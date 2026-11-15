const http = require('node:http');
const { db } = require('./db');
const { scan } = require('./moderation');
const { sendLoginCode, smtpConfigured } = require('./mailer');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, '..', 'public');
const BOARDS = ['qa', 'links', 'advice'];
const LANG_CODE_RE = /^https?:\/\//i;

const uid = () => crypto.randomUUID();
const now = () => Date.now();
const send = (res, code, obj) => {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
};

// ---------- password hashing (scrypt, no external deps) ----------
function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(pw, salt, 64).toString('hex');
  return salt + ':' + hash;
}
function verifyPassword(pw, stored) {
  const parts = String(stored || '').split(':');
  if (parts.length !== 2) return false;
  const h = crypto.scryptSync(pw, parts[0], 64).toString('hex');
  const a = Buffer.from(h), b = Buffer.from(parts[1]);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ---------- helpers ----------
function getSettings() {
  return db.prepare('SELECT siteName, defaultLang, schoolDomain, devMode FROM settings WHERE id = 1').get();
}

// 有效 devMode：环境变量 DEV_MODE 优先于数据库设置
// DEV_MODE=0 → 强制关闭（上线必须关）；未设置 → 用数据库里的值
function devModeOn(st) {
  const env = process.env.DEV_MODE;
  if (env !== undefined && env !== '') {
    const v = String(env).trim().toLowerCase();
    return v === '1' || v === 'true' || v === 'yes';
  }
  return !!st.devMode;
}

// 验证码发送频率限制：同一邮箱 45 秒内只能要一次，10 分钟内最多 5 次
const codeHits = new Map();
function tooManyCodes(email) {
  const now = Date.now();
  let h = codeHits.get(email);
  if (!h || now - h.windowStart > 10 * 60 * 1000) h = { windowStart: now, count: 0, lastAt: 0 };
  if (now - h.lastAt < 45 * 1000) { codeHits.set(email, h); return 'wait'; }
  if (h.count >= 5) { codeHits.set(email, h); return 'limit'; }
  h.count++; h.lastAt = now;
  codeHits.set(email, h);
  return null;
}
function userById(id) {
  return db.prepare('SELECT id, email, real_name AS nickname, avatar, bio, hobby, program, interests, role, status, muted_until, warnings, conductAccepted, needOnboard, created_at FROM users WHERE id = ?').get(id);
}
function userByToken(token) {
  if (!token) return null;
  const s = db.prepare('SELECT user_id, expires FROM sessions WHERE token = ?').get(token);
  if (!s || s.expires < now()) return null;
  const u = userById(s.user_id);
  if (u) db.prepare('UPDATE users SET last_seen = ? WHERE id = ?').run(now(), u.id);
  return u;
}
function publicUser(u) {
  if (!u) return null;
  return { id: u.id, nickname: u.nickname, avatar: u.avatar, bio: u.bio, hobby: u.hobby || '', program: u.program || '', interests: safeJson(u.interests), role: u.role, status: u.status, warnings: u.warnings, conductAccepted: u.conductAccepted, needOnboard: u.needOnboard };
}
function safeJson(s) { try { return JSON.parse(s || '[]'); } catch { return []; } }
function isMuted(u) { return u && u.status === 'muted' && u.muted_until > now(); }
function isBanned(u) { return u && u.status === 'banned'; }
function requireAuth(u, res) {
  if (!u) { send(res, 401, { error: 'Please sign in' }); return true; }
  if (isBanned(u)) { send(res, 403, { error: 'Your account is banned' }); return true; }
  if (isMuted(u)) { send(res, 403, { error: 'You are temporarily muted' }); return true; }
  return false;
}
function requireAdmin(u, res) {
  if (!u) { send(res, 401, { error: 'Please sign in' }); return true; }
  if (!['admin', 'moderator'].includes(u.role)) { send(res, 403, { error: 'Admins only' }); return true; }
  return false;
}

function moderateAndInsertPost(u, board, title, body, url, category, year, subject) {
  const r = scan((title || '') + ' ' + (body || ''));
  if (r.crisis) return { crisis: true, blocked: true };
  if (r.blocked) return { blocked: true, words: r.words };
  const flagged = (r.categories.bullying.length || r.categories.selfharm.length || r.categories.slur.length || r.categories.local.length) ? 1 : 0;
  const id = uid();
  db.prepare("INSERT INTO posts (id, user_id, board, title, body, url, category, year, subject, flagged, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .run(id, u.id, board, title || '', body || '', url || null, category || null, year || null, subject || null, flagged, now());
  return { id, flagged };
}

function enrichPost(p) {
  const author = db.prepare('SELECT id, real_name AS nickname, avatar FROM users WHERE id = ?').get(p.user_id);
  return { ...p, author: author ? { id: author.id, nickname: author.nickname, avatar: author.avatar } : { id: null, nickname: 'Unknown', avatar: '🐱' }, interests: undefined };
}

// ---------- API ----------
async function handleApi(req, res, pathname, body) {
  const st = getSettings();
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const me = userByToken(token);

  // settings (public)
  if (pathname === '/api/settings' && req.method === 'GET') {
    return send(res, 200, { ok: true, siteName: st.siteName, defaultLang: st.defaultLang, schoolDomain: st.schoolDomain, devMode: devModeOn(st), smtpConfigured: smtpConfigured(), languages: ['en', 'zh'] });
  }

  // auth: signup (email + password, school email only)
  if (pathname === '/api/auth/signup' && req.method === 'POST') {
    const email = (body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const domain = st.schoolDomain;
    if (!email.endsWith('@' + domain) && !email.endsWith('.' + domain)) return send(res, 400, { error: 'Use your school email (@' + domain + ')' });
    if (password.length < 6) return send(res, 400, { error: 'Password must be at least 6 characters' });
    if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) return send(res, 400, { error: 'This email is already registered' });
    const count = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
    const role = count === 0 ? 'admin' : 'student';
    const id = uid();
    const nick = (email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') || 'user') + id.slice(0, 6);
    db.prepare('INSERT INTO users (id, email, nickname, role, password, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, email, nick, role, hashPassword(password), now());
    const t = uid();
    db.prepare('INSERT INTO sessions (token, user_id, expires) VALUES (?, ?, ?)').run(t, id, now() + 30 * 86400000);
    const user = userById(id);
    return send(res, 200, { ok: true, token: t, needOnboard: !!user.needOnboard, role: user.role });
  }

  // auth: login
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    const email = (body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const u = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!u || !u.password || !verifyPassword(password, u.password)) return send(res, 401, { error: 'Wrong email or password' });
    if (u.status === 'banned') return send(res, 403, { error: 'This account is banned' });
    const t = uid();
    db.prepare('INSERT INTO sessions (token, user_id, expires) VALUES (?, ?, ?)').run(t, u.id, now() + 30 * 86400000);
    const user = userById(u.id);
    return send(res, 200, { ok: true, token: t, needOnboard: !!user.needOnboard, role: user.role });
  }

  // auth: me (read)
  if (pathname === '/api/me' && req.method === 'GET') {
    if (!me) return send(res, 401, { error: 'Please sign in' });
    return send(res, 200, publicUser(me));
  }

  // auth: me (edit profile)
  if (pathname === '/api/me' && req.method === 'PATCH') {
    if (!me) return send(res, 401, { error: 'Please sign in' });
    const realName = (typeof body.real_name === 'string' && body.real_name.trim()) ? body.real_name.trim().slice(0, 24) : (me.nickname || '');
    const avatar = (body.avatar || me.avatar || '🐱').slice(0, 8);
    const bio = typeof body.bio === 'string' ? body.bio.slice(0, 300) : (me.bio || '');
    const hobby = typeof body.hobby === 'string' ? body.hobby.slice(0, 60) : (me.hobby || '');
    const program = typeof body.program === 'string' ? body.program.slice(0, 20) : (me.program || '');
    const interests = Array.isArray(body.interests) ? JSON.stringify(body.interests.map(x => String(x).trim()).filter(Boolean).slice(0, 20)) : (me.interests || '[]');
    db.prepare('UPDATE users SET real_name = ?, avatar = ?, bio = ?, hobby = ?, program = ?, interests = ? WHERE id = ?')
      .run(realName, avatar, bio, hobby, program, interests, me.id);
    return send(res, 200, { ok: true, user: publicUser(userById(me.id)) });
  }

  // auth: onboard
  if (pathname === '/api/auth/onboard' && req.method === 'POST') {
    if (!me) return send(res, 401, { error: 'Please sign in' });
    const realName = (body.real_name || '').trim();
    if (realName.length < 2) return send(res, 400, { error: 'Please enter your real name' });
    db.prepare("UPDATE users SET real_name = ?, avatar = ?, bio = ?, hobby = ?, program = ?, interests = ?, needOnboard = 0 WHERE id = ?")
      .run(realName.slice(0, 24), body.avatar || '🐱', (body.bio || '').slice(0, 300), (body.hobby || '').slice(0, 60), (body.program || '').slice(0, 20), JSON.stringify((body.interests || []).slice(0, 20)), me.id);
    return send(res, 200, { ok: true });
  }

  // auth: accept-conduct
  if (pathname === '/api/auth/accept-conduct' && req.method === 'POST') {
    if (!me) return send(res, 401, { error: 'Please sign in' });
    db.prepare("UPDATE users SET conductAccepted = 1 WHERE id = ?").run(me.id);
    return send(res, 200, { ok: true });
  }

  // auth: logout
  if (pathname === '/api/auth/logout' && req.method === 'POST') {
    if (token) db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    return send(res, 200, { ok: true });
  }

  // boards (public)
  if (pathname === '/api/boards' && req.method === 'GET') {
    const rows = db.prepare('SELECT id, name, name_zh, desc, desc_zh FROM boards').all();
    return send(res, 200, { boards: rows });
  }

  // home (public)
  if (pathname === '/api/home' && req.method === 'GET') {
    const boards = db.prepare('SELECT id, name, name_zh, desc, desc_zh FROM boards').all();
    const recent = db.prepare('SELECT * FROM posts ORDER BY created_at DESC LIMIT 12').all().map(enrichPost);
    return send(res, 200, { boards, recent });
  }

  // posts list (public)
  if (pathname === '/api/posts' && req.method === 'GET') {
    const board = req.url.includes('board=') ? new URL(req.url, 'http://x').searchParams.get('board') : null;
    const user = req.url.includes('user=') ? new URL(req.url, 'http://x').searchParams.get('user') : null;
    let sql = 'SELECT * FROM posts';
    const where = []; const args = [];
    if (board) { where.push('board = ?'); args.push(board); }
    if (user) { where.push('user_id = ?'); args.push(user); }
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    sql += ' ORDER BY created_at DESC LIMIT 50';
    const posts = db.prepare(sql).all(...args).map(enrichPost);
    return send(res, 200, { posts });
  }

  // create post
  if (pathname === '/api/posts' && req.method === 'POST') {
    const e = requireAuth(me, res); if (e) return;
    if (!me.conductAccepted) return send(res, 403, { error: 'Please accept the Code of Conduct first' });
    const board = (body.board || 'qa');
    if (!BOARDS.includes(board)) return send(res, 400, { error: 'Unknown board' });
    const title = (body.title || '').trim();
    const text = (body.body || '').trim();
    if (!text && !title && board !== 'links') return send(res, 400, { error: 'Write something' });
    let url = null, category = null, year = null, subject = null;
    if (board === 'links') {
      url = (body.url || '').trim();
      if (!LANG_CODE_RE.test(url)) return send(res, 400, { error: 'A valid http(s) link is required' });
    } else {
      category = (body.category || '').slice(0, 40);
      year = (body.year || '').slice(0, 20);
      subject = (body.subject || '').slice(0, 60);
    }
    const r = moderateAndInsertPost(me, board, title, text, url, category, year, subject);
    if (r.crisis) return send(res, 200, { crisis: true });
    if (r.blocked) return send(res, 200, { blocked: true, words: r.words });
    return send(res, 200, { ok: true, id: r.id });
  }

  // post detail / like / comments (prefix match on id)
  let m = pathname.match(/^\/api\/posts\/([\w-]+)/);
  if (m && pathname === '/api/posts/' + m[1] && req.method === 'GET') {
    const p = db.prepare('SELECT * FROM posts WHERE id = ?').get(m[1]);
    if (!p) return send(res, 404, { error: 'Not found' });
    const author = db.prepare('SELECT id, real_name AS nickname, avatar, bio FROM users WHERE id = ?').get(p.user_id);
    const comments = db.prepare('SELECT c.*, u.real_name AS nickname, u.avatar FROM comments c LEFT JOIN users u ON u.id = c.user_id WHERE c.post_id = ? ORDER BY c.created_at ASC').all(p.id);
    return send(res, 200, { post: enrichPost(p), author: author ? publicUser(author) : null, comments });
  }

  // delete post
  if (m && pathname === '/api/posts/' + m[1] && req.method === 'DELETE') {
    const e = requireAuth(me, res); if (e) return;
    const p = db.prepare('SELECT user_id FROM posts WHERE id = ?').get(m[1]);
    if (!p) return send(res, 404, { error: 'Not found' });
    if (p.user_id !== me.id && !['admin', 'moderator'].includes(me.role)) return send(res, 403, { error: 'Not allowed' });
    db.prepare('DELETE FROM posts WHERE id = ?').run(m[1]);
    return send(res, 200, { ok: true });
  }

  // like post
  if (m && pathname.endsWith('/like') && req.method === 'POST') {
    const e = requireAuth(me, res); if (e) return;
    const pid = m[1];
    const existing = db.prepare('SELECT 1 FROM post_likes WHERE user_id = ? AND post_id = ?').get(me.id, pid);
    if (existing) { db.prepare('DELETE FROM post_likes WHERE user_id = ? AND post_id = ?').run(me.id, pid); db.prepare('UPDATE posts SET likes = likes - 1 WHERE id = ?').run(pid); }
    else { db.prepare('INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)').run(me.id, pid); db.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ?').run(pid); }
    return send(res, 200, { ok: true });
  }

  // comments
  if (m && pathname.endsWith('/comments') && req.method === 'POST') {
    const e = requireAuth(me, res); if (e) return;
    if (!me.conductAccepted) return send(res, 403, { error: 'Please accept the Code of Conduct first' });
    const text = (body.body || '').trim();
    if (!text) return send(res, 400, { error: 'Write something' });
    const sc = scan(text);
    if (sc.crisis) return send(res, 200, { crisis: true });
    if (sc.blocked) return send(res, 200, { blocked: true, words: sc.words });
    const flagged = (sc.categories.bullying.length || sc.categories.selfharm.length || sc.categories.slur.length || sc.categories.local.length) ? 1 : 0;
    const cid = uid();
    db.prepare("INSERT INTO comments (id, post_id, user_id, body, flagged, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(cid, m[1], me.id, text, flagged, now());
    db.prepare('UPDATE posts SET comments = comments + 1 WHERE id = ?').run(m[1]);
    return send(res, 200, { ok: true, id: cid, flagged });
  }

  // like comment
  let cm = pathname.match(/^\/api\/comments\/([\w-]+)\/(like|verify)$/);
  if (cm && req.method === 'POST') {
    const e = requireAuth(me, res); if (e) return;
    const cid = cm[1];
    if (cm[2] === 'verify') {
      const a = requireAdmin(me, res); if (a) return;
      const cur = db.prepare('SELECT verified FROM comments WHERE id = ?').get(cid);
      if (!cur) return send(res, 404, { error: 'Not found' });
      db.prepare('UPDATE comments SET verified = ? WHERE id = ?').run(cur.verified ? 0 : 1, cid);
      return send(res, 200, { ok: true, verified: !cur.verified });
    }
    const existing = db.prepare('SELECT 1 FROM comment_likes WHERE user_id = ? AND comment_id = ?').get(me.id, cid);
    if (existing) { db.prepare('DELETE FROM comment_likes WHERE user_id = ? AND comment_id = ?').run(me.id, cid); db.prepare('UPDATE comments SET likes = likes - 1 WHERE id = ?').run(cid); }
    else { db.prepare('INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?)').run(me.id, cid); db.prepare('UPDATE comments SET likes = likes + 1 WHERE id = ?').run(cid); }
    return send(res, 200, { ok: true });
  }

  // report
  if (pathname === '/api/report' && req.method === 'POST') {
    const e = requireAuth(me, res); if (e) return;
    const kind = body.kind === 'comment' ? 'comment' : 'post';
    const target = db.prepare(kind === 'post' ? 'SELECT user_id FROM posts WHERE id = ?' : 'SELECT user_id FROM comments WHERE id = ?').get(body.targetId);
    if (!target) return send(res, 404, { error: 'Not found' });
    db.prepare("INSERT INTO reports (id, kind, target_id, target_type, reason, note, reporter_id, author_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .run(uid(), kind, body.targetId, kind, body.reason || 'Other', (body.note || '').slice(0, 300), me.id, target.user_id, now());
    return send(res, 200, { ok: true });
  }

  // feedback
  if (pathname === '/api/feedback' && req.method === 'POST') {
    const e = requireAuth(me, res); if (e) return;
    db.prepare("INSERT INTO feedback (id, user_id, type, body, created_at) VALUES (?, ?, ?, ?, ?)").run(uid(), me.id, body.type || 'General', (body.body || '').slice(0, 1000), now());
    return send(res, 200, { ok: true });
  }
  if (pathname === '/api/admin/feedback' && req.method === 'GET') {
    const e = requireAdmin(me, res); if (e) return;
    const rows = db.prepare('SELECT f.*, u.real_name AS nickname FROM feedback f LEFT JOIN users u ON u.id = f.user_id ORDER BY f.created_at DESC').all();
    return send(res, 200, { feedback: rows });
  }

  // ---------- chat ----------
  if (pathname === '/api/conversations' && req.method === 'GET') {
    const e = requireAuth(me, res); if (e) return;
    const rows = db.prepare('SELECT c.id, c.type, c.name, c.created_at FROM conversations c JOIN conversation_members cm ON cm.conversation_id = c.id WHERE cm.user_id = ? ORDER BY c.created_at DESC').all(me.id);
    const out = rows.map(r => {
      const members = db.prepare('SELECT u.id, u.real_name AS nickname, u.avatar FROM conversation_members cm JOIN users u ON u.id = cm.user_id WHERE cm.conversation_id = ?').all(r.id);
      const last = db.prepare('SELECT body, created_at FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT 1').get(r.id);
      return { ...r, members, last };
    });
    return send(res, 200, { conversations: out });
  }
  if (pathname === '/api/conversations' && req.method === 'POST') {
    const e = requireAuth(me, res); if (e) return;
    const type = body.type === 'group' ? 'group' : 'dm';
    const memberIds = Array.isArray(body.memberIds) ? body.memberIds.filter(x => x && x !== me.id).slice(0, 50) : [];
    if (!memberIds.length) return send(res, 400, { error: 'Select at least one person' });
    const cid = uid();
    db.prepare("INSERT INTO conversations (id, type, name, created_by, created_at) VALUES (?, ?, ?, ?, ?)").run(cid, type, (body.name || '').slice(0, 60), me.id, now());
    db.prepare('INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?)').run(cid, me.id);
    for (const mid of memberIds) db.prepare('INSERT OR IGNORE INTO conversation_members (conversation_id, user_id) VALUES (?, ?)').run(cid, mid);
    return send(res, 200, { ok: true, id: cid });
  }
  // single conversation meta (used by the chat screen header)
  let cmeta = pathname.match(/^\/api\/conversations\/([\w-]+)$/);
  if (cmeta && req.method === 'GET') {
    const e = requireAuth(me, res); if (e) return;
    const c = db.prepare('SELECT id, type, name, created_at FROM conversations WHERE id = ?').get(cmeta[1]);
    if (!c) return send(res, 404, { error: 'Not found' });
    const mem = db.prepare('SELECT 1 FROM conversation_members WHERE conversation_id = ? AND user_id = ?').get(c.id, me.id);
    if (!mem) return send(res, 403, { error: 'Not a member' });
    const members = db.prepare('SELECT u.id, u.real_name AS nickname, u.avatar FROM conversation_members cm JOIN users u ON u.id = cm.user_id WHERE cm.conversation_id = ?').all(c.id);
    return send(res, 200, { conversation: { ...c, members } });
  }

  let conv = pathname.match(/^\/api\/conversations\/([\w-]+)\/messages$/);
  if (conv && req.method === 'GET') {
    const e = requireAuth(me, res); if (e) return;
    const mem = db.prepare('SELECT 1 FROM conversation_members WHERE conversation_id = ? AND user_id = ?').get(conv[1], me.id);
    if (!mem) return send(res, 403, { error: 'Not a member' });
    const msgs = db.prepare('SELECT m.id, m.user_id, m.body, m.created_at, u.real_name AS nickname, u.avatar FROM messages m LEFT JOIN users u ON u.id = m.user_id WHERE m.conversation_id = ? ORDER BY m.created_at ASC').all(conv[1]);
    return send(res, 200, { messages: msgs });
  }
  if (conv && req.method === 'POST') {
    const e = requireAuth(me, res); if (e) return;
    const mem = db.prepare('SELECT 1 FROM conversation_members WHERE conversation_id = ? AND user_id = ?').get(conv[1], me.id);
    if (!mem) return send(res, 403, { error: 'Not a member' });
    const text = (body.body || '').trim();
    if (!text) return send(res, 400, { error: 'Write something' });
    const sc = scan(text);
    if (sc.crisis) return send(res, 200, { crisis: true });
    if (sc.blocked) return send(res, 200, { blocked: true, words: sc.words });
    db.prepare("INSERT INTO messages (id, conversation_id, user_id, body, created_at) VALUES (?, ?, ?, ?, ?)").run(uid(), conv[1], me.id, text.slice(0, 2000), now());
    return send(res, 200, { ok: true });
  }

  // interest matches
  if (pathname === '/api/matches' && req.method === 'GET') {
    const e = requireAuth(me, res); if (e) return;
    const mine = safeJson(me.interests);
    const users = db.prepare("SELECT id, real_name AS nickname, avatar, interests, role, status FROM users WHERE id != ? AND status = 'active'").all(me.id);
    const out = [];
    for (const u of users) {
      const their = safeJson(u.interests);
      const shared = mine.filter(x => their.includes(x));
      if (shared.length) out.push({ id: u.id, nickname: u.nickname, avatar: u.avatar, role: u.role, shared });
    }
    return send(res, 200, { matches: out });
  }

  // user profile (public)
  let um = pathname.match(/^\/api\/users\/([\w-]+)$/);
  if (um && req.method === 'GET') {
    const u = db.prepare('SELECT id, real_name AS nickname, avatar, bio, hobby, program, interests, role, status, warnings, conductAccepted, needOnboard, created_at FROM users WHERE id = ?').get(um[1]);
    if (!u) return send(res, 404, { error: 'Not found' });
    const posts = db.prepare('SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC LIMIT 30').all(u.id).map(enrichPost);
    return send(res, 200, { user: publicUser(u), posts });
  }

  // ---------- admin ----------
  if (pathname === '/api/admin/reports' && req.method === 'GET') {
    const e = requireAdmin(me, res); if (e) return;
    const rows = db.prepare("SELECT * FROM reports WHERE status = 'open' ORDER BY created_at DESC").all();
    const out = rows.map(r => {
      let author = null;
      if (r.author_id) author = db.prepare('SELECT id, real_name AS nickname, avatar FROM users WHERE id = ?').get(r.author_id);
      let target = null;
      if (r.target_type === 'post') target = db.prepare('SELECT id, title, body, board FROM posts WHERE id = ?').get(r.target_id);
      else target = db.prepare('SELECT id, body, post_id FROM comments WHERE id = ?').get(r.target_id);
      return { ...r, author: author ? { id: author.id, nickname: author.nickname, avatar: author.avatar } : null, target };
    });
    return send(res, 200, { reports: out });
  }
  let arm = pathname.match(/^\/api\/admin\/reports\/([\w-]+)$/);
  if (arm && req.method === 'POST') {
    const e = requireAdmin(me, res); if (e) return;
    const report = db.prepare('SELECT id, target_type, target_id FROM reports WHERE id = ?').get(arm[1]);
    if (!report) return send(res, 404, { error: 'Not found' });
    if (body.removeTarget) {
      if (report.target_type === 'comment') {
        const c = db.prepare('SELECT post_id FROM comments WHERE id = ?').get(report.target_id);
        db.prepare('DELETE FROM comments WHERE id = ?').run(report.target_id);
        if (c) db.prepare('UPDATE posts SET comments = comments - 1 WHERE id = ? AND comments > 0').run(c.post_id);
      } else {
        db.prepare('DELETE FROM post_likes WHERE post_id = ?').run(report.target_id);
        db.prepare('DELETE FROM comments WHERE post_id = ?').run(report.target_id);
        db.prepare('DELETE FROM posts WHERE id = ?').run(report.target_id);
      }
    }
    db.prepare("UPDATE reports SET status = 'resolved' WHERE id = ?").run(arm[1]);
    return send(res, 200, { ok: true });
  }
  if (pathname === '/api/admin/users' && req.method === 'GET') {
    const e = requireAdmin(me, res); if (e) return;
    const rows = db.prepare('SELECT id, email, real_name AS nickname, avatar, role, status, warnings, muted_until, created_at FROM users ORDER BY created_at DESC').all();
    return send(res, 200, { users: rows });
  }
  let aum = pathname.match(/^\/api\/admin\/users\/([\w-]+)$/);
  if (aum && req.method === 'POST') {
    const e = requireAdmin(me, res); if (e) return;
    const target = db.prepare('SELECT * FROM users WHERE id = ?').get(aum[1]);
    if (!target) return send(res, 404, { error: 'Not found' });
    const action = body.action;
    if (action === 'warn') {
      db.prepare('INSERT INTO user_warnings (id, user_id, reason, created_at) VALUES (?, ?, ?, ?)').run(uid(), target.id, (body.reason || '').slice(0, 300), now());
      const w = db.prepare('SELECT COUNT(*) AS c FROM user_warnings WHERE user_id = ?').get(target.id).c;
      db.prepare('UPDATE users SET warnings = ? WHERE id = ?').run(w, target.id);
      if (w >= 3 && target.status === 'active') db.prepare("UPDATE users SET status = 'muted', muted_until = ? WHERE id = ?").run(now() + 86400000, target.id);
    } else if (action === 'mute') {
      const days = Math.max(1, Math.min(30, Number(body.days) || 1));
      db.prepare("UPDATE users SET status = 'muted', muted_until = ? WHERE id = ?").run(now() + days * 86400000, target.id);
    } else if (action === 'unmute') {
      db.prepare("UPDATE users SET status = 'active', muted_until = 0 WHERE id = ?").run(target.id);
    } else if (action === 'ban') {
      db.prepare("UPDATE users SET status = 'banned' WHERE id = ?").run(target.id);
    } else if (action === 'unban') {
      db.prepare("UPDATE users SET status = 'active' WHERE id = ?").run(target.id);
    } else if (action === 'promote') {
      db.prepare("UPDATE users SET role = 'moderator' WHERE id = ?").run(target.id);
    } else if (action === 'promote-admin') {
      if (me.role !== 'admin') return send(res, 403, { error: 'Admin only' });
      db.prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(target.id);
    } else if (action === 'demote') {
      if (me.role !== 'admin') return send(res, 403, { error: 'Admin only' });
      if (target.id === me.id) return send(res, 400, { error: 'Cannot demote yourself' });
      db.prepare("UPDATE users SET role = 'student' WHERE id = ?").run(target.id);
    } else return send(res, 400, { error: 'Unknown action' });
    return send(res, 200, { ok: true });
  }
  if (pathname === '/api/admin/stats' && req.method === 'GET') {
    const e = requireAdmin(me, res); if (e) return;
    const s = (q) => db.prepare(q).get();
    return send(res, 200, {
      users: s("SELECT COUNT(*) AS c FROM users").c,
      posts: s("SELECT COUNT(*) AS c FROM posts").c,
      comments: s("SELECT COUNT(*) AS c FROM comments").c,
      openReports: s("SELECT COUNT(*) AS c FROM reports WHERE status = 'open'").c,
      openFeedback: s("SELECT COUNT(*) AS c FROM feedback").c,
      flagged: s("SELECT COUNT(*) AS c FROM posts WHERE flagged = 1").c + s("SELECT COUNT(*) AS c FROM comments WHERE flagged = 1").c
    });
  }
  if (pathname === '/api/admin/modqueue' && req.method === 'GET') {
    const e = requireAdmin(me, res); if (e) return;
    const posts = db.prepare('SELECT id, board, title, body, user_id, created_at FROM posts WHERE flagged = 1 ORDER BY created_at DESC').all();
    const comments = db.prepare('SELECT id, post_id, body, user_id, created_at FROM comments WHERE flagged = 1 ORDER BY created_at DESC').all();
    return send(res, 200, { posts, comments });
  }

  // ---------- find friends (people directory) ----------
  if (pathname === '/api/people' && req.method === 'GET') {
    const e = requireAuth(me, res); if (e) return;
    const q = (new URL(req.url, 'http://x').searchParams.get('q') || '').trim().toLowerCase();
    const mine = safeJson(me.interests);
    const rows = db.prepare("SELECT id, real_name AS nickname, avatar, bio, hobby, program, interests, role, status, last_seen FROM users WHERE status != 'banned' AND id != ? ORDER BY last_seen DESC, nickname ASC LIMIT 100").all(me.id);
    const out = rows.filter(u => {
      if (!q) return true;
      const hay = (u.nickname + ' ' + (u.bio || '') + ' ' + (u.hobby || '') + ' ' + (u.program || '') + ' ' + (u.interests || '')).toLowerCase();
      return hay.includes(q);
    }).map(u => {
      const their = safeJson(u.interests);
      return { id: u.id, nickname: u.nickname, avatar: u.avatar, bio: u.bio, hobby: u.hobby || '', program: u.program || '', interests: their, shared: mine.filter(x => their.includes(x)), role: u.role, status: u.status, online: (now() - (u.last_seen || 0)) < 10 * 60 * 1000 };
    });
    return send(res, 200, { people: out });
  }

  // ---------- groups (programme / interest communities) ----------
  if (pathname === '/api/groups' && req.method === 'GET') {
    const e = requireAuth(me, res); if (e) return;
    const rows = db.prepare("SELECT c.id, c.name, c.description, c.created_by FROM conversations c WHERE c.type = 'group' ORDER BY c.name ASC").all();
    const out = rows.map(r => {
      const member = db.prepare('SELECT 1 FROM conversation_members WHERE conversation_id = ? AND user_id = ?').get(r.id, me.id);
      const count = db.prepare('SELECT COUNT(*) AS c FROM conversation_members WHERE conversation_id = ?').get(r.id).c;
      return { id: r.id, name: r.name, description: r.description, joined: !!member, members: count };
    });
    return send(res, 200, { groups: out });
  }
  if (pathname === '/api/groups' && req.method === 'POST') {
    const e = requireAuth(me, res); if (e) return;
    const name = (body.name || '').trim().slice(0, 60);
    if (!name) return send(res, 400, { error: 'Group name required' });
    const cid = uid();
    db.prepare("INSERT INTO conversations (id, type, name, description, created_by, created_at) VALUES (?, 'group', ?, ?, ?, ?)").run(cid, name, (body.description || '').slice(0, 300), me.id, now());
    db.prepare('INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?)').run(cid, me.id);
    return send(res, 200, { ok: true, id: cid });
  }
  let gid = pathname.match(/^\/api\/groups\/([\w-]+)\/(join|leave)$/);
  if (gid && req.method === 'POST') {
    const e = requireAuth(me, res); if (e) return;
    const g = db.prepare("SELECT id FROM conversations WHERE id = ? AND type = 'group'").get(gid[1]);
    if (!g) return send(res, 404, { error: 'Not found' });
    if (gid[2] === 'join') db.prepare('INSERT OR IGNORE INTO conversation_members (conversation_id, user_id) VALUES (?, ?)').run(gid[1], me.id);
    else db.prepare('DELETE FROM conversation_members WHERE conversation_id = ? AND user_id = ?').run(gid[1], me.id);
    return send(res, 200, { ok: true });
  }

  // ---------- admin: manage Links board ----------
  if (pathname === '/api/admin/links' && req.method === 'GET') {
    const e = requireAdmin(me, res); if (e) return;
    const rows = db.prepare("SELECT id, title, body, url, created_at, user_id FROM posts WHERE board = 'links' ORDER BY created_at DESC").all();
    const out = rows.map(r => ({ ...r, author: (db.prepare('SELECT real_name AS nickname FROM users WHERE id = ?').get(r.user_id) || {}).nickname || null }));
    return send(res, 200, { links: out });
  }
  if (pathname === '/api/admin/links' && req.method === 'POST') {
    const e = requireAdmin(me, res); if (e) return;
    const url = (body.url || '').trim();
    if (!/^https?:\/\//i.test(url)) return send(res, 400, { error: 'A valid http(s) link is required' });
    const id = uid();
    db.prepare("INSERT INTO posts (id, board, title, body, url, user_id, created_at) VALUES (?, 'links', ?, ?, ?, ?, ?)").run(id, (body.title || '').slice(0, 120), (body.body || '').slice(0, 500), url, me.id, now());
    return send(res, 200, { ok: true, id });
  }
  // admin: download a consistent database snapshot (VACUUM INTO)
  if (pathname === '/api/admin/backup' && req.method === 'GET') {
    const e = requireAdmin(me, res); if (e) return;
    const dataDir = path.join(__dirname, '..', 'data');
    fs.mkdirSync(dataDir, { recursive: true });
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    const tmp = path.join(dataDir, `.snapshot-${stamp}.db`);
    try {
      db.exec("VACUUM INTO '" + tmp.replace(/'/g, "''") + "'");
      const buf = fs.readFileSync(tmp);
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="nexus-backup-${stamp}.db"`,
        'Content-Length': buf.length
      });
      res.end(buf);
    } catch (err) {
      console.error('[backup]', err);
      try { fs.unlinkSync(tmp); } catch {}
      return send(res, 500, { error: 'Backup failed: ' + String(err && err.message || err) });
    }
    try { fs.unlinkSync(tmp); } catch {}
    return;
  }

  let lid = pathname.match(/^\/api\/admin\/links\/([\w-]+)$/);
  if (lid && req.method === 'DELETE') {
    const e = requireAdmin(me, res); if (e) return;
    db.prepare("DELETE FROM posts WHERE id = ? AND board = 'links'").run(lid[1]);
    return send(res, 200, { ok: true });
  }

  return send(res, 404, { error: 'Not found' });
}

// ---------- static ----------
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };
function serveStatic(req, res, pathname) {
  let rel = pathname === '/' ? '/index.html' : pathname;
  const fp = path.join(PUBLIC, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
  if (!fp.startsWith(PUBLIC)) return send(res, 403, { error: 'Forbidden' });
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'application/octet-stream' });
    res.end(data);
  });
}

// ---------- server ----------
const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', c => { body += c; if (body.length > 5e6) req.destroy(); });
  req.on('end', () => {
    let parsed = {};
    if (body) { try { parsed = JSON.parse(body); } catch { return send(res, 400, { error: 'Bad JSON' }); } }
    const pathname = req.url.split('?')[0];
    if (pathname.startsWith('/api/')) {
      Promise.resolve()
        .then(() => handleApi(req, res, pathname, parsed))
        .catch(e => { console.error(e); if (!res.headersSent) send(res, 500, { error: 'Server error', detail: String(e && e.message || e) }); });
    } else serveStatic(req, res, pathname);
  });
});

server.listen(PORT, () => console.log('NEXUS running on http://localhost:' + PORT));
