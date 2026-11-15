'use strict';
const LS = 'nexus_token';

const LANG = {
  en: {
    welcome: 'Welcome to NEXUS - a friendly place to help each other, make friends, and connect. For every new student, and any student who wants to communicate.', bekind: 'Be kind', nocyber: 'No cyberbullying', moderated: 'Auto-screened for unsafe language', schoolInfo: 'School', newPost: 'New post', schoolTitle: 'School Information', hobby: 'Hobby', programme: 'Programme', back: 'Back', pickAvatar: 'Pick an avatar', saved: 'Saved', noProgram: 'No programme', memberCount: 'members', msgEmpty: 'Say hi 👋', guidelinesNote: 'Please read before you post.',
    signin: 'Sign in', login: 'Log in', signup: 'Sign up', password: 'Password', signout: 'Sign out', home: 'Home', profile: 'My Profile', admin: 'Admin',
    links: 'Links', guidelines: 'Guidelines', faq: 'FAQ', feedback: 'Feedback',
    ask: 'New post', postTitle: 'Title (optional)', postBody: 'What do you want to say?', send: 'Post', cancel: 'Cancel',
    recent: 'Recent', boards: 'Boards', visit: 'Visit ↗', comments: 'comments', like: 'Like', liked: 'Liked',
    helpful: 'Helpful', verified: 'Verified Staff', report: 'Report', reason: 'Reason', submit: 'Submit',
    signinToPost: 'Sign in to post and comment.', accept: 'I agree', codTitle: 'Code of Conduct',
    nickname: 'Nickname', realname: 'Real name', bio: 'Bio', interests: 'Interests (comma separated)', avatar: 'Avatar', save: 'Save', edit: 'Edit',
    none: 'None', joined: 'Joined', loading: 'Loading...', notFound: 'Not found', pleaseSignin: 'Please sign in',
    cat: 'Category', year: 'Year level', subject: 'Subject', url: 'Link URL (https://...)', urlReq: 'A valid http(s) link is required',
    tabReports: 'Reports', tabUsers: 'Users', tabFeedback: 'Feedback', tabMod: 'Review queue',
    backup: '⬇ Backup DB', backupDone: 'Backup downloaded',
    warn: 'Warn', mute: 'Mute', ban: 'Ban', promote: 'Promote', manage: 'Manage', resolve: 'Resolve', dismiss: 'Dismiss', remove: 'Delete',
    openReports: 'Open reports', warnings: 'warnings', author: 'author', warnReason: 'Warning reason?',
    faqTitle: 'Frequently Asked Questions', fq1: 'Do I need a real name?', fa1: 'Yes. Please use your real name so everyone is accountable.',
    fq2: 'Is everything moderated?', fa2: 'Posts are auto-screened for unsafe language. Reported content is reviewed by moderators - we do not pre-moderate every post.',
    fq3: 'I saw something hurtful. What do I do?', fa3: 'Use the 🚩 Report button on any post or comment. In a crisis, send an email to your teachers.',
    fq4: 'Can I post links?', fa4: 'Yes - use the Links board and add a http(s) URL.',
    fq5: 'Who can see my profile?', fa5: 'Any signed-in student. Guests can only browse.',
    gTitle: 'Community Guidelines', g1: 'Be respectful. No bullying, harassment, or hate speech.', g2: 'No posting of others’ real names or personal info.',
    g3: 'Unsafe or self-harm content is blocked; if you are in crisis, send an email to your teachers.', g4: 'Reported content is reviewed by moderators.',
    messages: 'Messages', newChat: 'New chat', matches: 'Matches', shared: 'shared', startChat: 'Chat',
    composeMsg: 'Type a message...', noConv: 'No conversations yet. Start one from Find friends or New chat.', typeName: 'Nickname to search', search: 'Search',
    blocked: 'Your message was blocked by the safety filter.', crisis: 'If you are in crisis, please send an email to your teachers.',
    findFriends: 'Find friends', groups: 'Groups', join: 'Join', leave: 'Leave', createGroup: 'Create group', groupName: 'Group name', groupDesc: 'Description (optional)', newGroup: 'New group', members: 'members', online: 'online', searchPeople: 'Search name or interest (e.g. guitar)', msg: 'Message', viewProfile: 'Profile', allGroups: 'All groups', myGroups: 'My groups', noPeople: 'No one matches yet - try another word.', noGroups: 'No groups yet.', promote: 'Promote to mod', promoteAdmin: 'Promote to admin', demote: 'Demote', unban: 'Unban', unmute: 'Unmute',
  },
  zh: {
    welcome: '欢迎来到 NEXUS —— 一个互相帮助、交朋友、认识同学的友好社区。为每一位新生，以及任何想交流的同学准备。', bekind: '友善待人', nocyber: '拒绝网络霸凌', moderated: '自动筛查不安全内容', schoolInfo: '学校信息', newPost: '发帖', schoolTitle: '学校信息', hobby: '爱好', programme: '学制', back: '返回', pickAvatar: '选择头像', saved: '已保存', noProgram: '未填写学制', memberCount: '人', msgEmpty: '打个招呼 👋', guidelinesNote: '发帖前请先阅读。',
    signin: '登录', login: '登录', signup: '注册', password: '密码', signout: '退出', home: '首页', profile: '我的主页', admin: '管理后台',
    links: '链接', guidelines: '社区准则', faq: '常见问题', feedback: '反馈',
    ask: '发帖', postTitle: '标题(可选)', postBody: '想说点什么?', send: '发布', cancel: '取消',
    recent: '最新', boards: '板块', visit: '前往 ↗', comments: '评论', like: '点赞', liked: '已赞',
    helpful: '有帮助', verified: '认证回答', report: '举报', reason: '原因', submit: '提交',
    signinToPost: '登录后才能发帖和评论。', accept: '我同意', codTitle: '社区行为准则',
    nickname: '昵称', realname: '真实姓名', bio: '简介', interests: '兴趣(逗号分隔)', avatar: '头像', save: '保存', edit: '编辑',
    none: '无', joined: '已加入', loading: '加载中...', notFound: '未找到', pleaseSignin: '请先登录',
    cat: '分类', year: '学制', subject: '学科', url: '链接地址(https://...)', urlReq: '需要有效的 http(s) 链接',
    tabReports: '举报', tabUsers: '用户', tabFeedback: '反馈', tabMod: '待查看',
    backup: '⬇ 备份数据库', backupDone: '备份已下载',
    warn: '警告', mute: '禁言', ban: '封禁', promote: '提升', manage: '管理', resolve: '处理', dismiss: '忽略', remove: '删除',
    openReports: '待处理举报', warnings: '次警告', author: '作者', warnReason: '警告原因?',
    faqTitle: '常见问题', fq1: '需要填真名吗?', fa1: '需要。请使用真实姓名，方便大家互相认识与负责。',
    fq2: '所有内容都审核吗?', fa2: '系统会自动筛查不安全用语。被举报的内容由管理员复核--我们不会逐条预审。',
    fq3: '看到伤人的内容怎么办?', fa3: '用任意帖子或评论上的 🚩 举报按钮。如遇危机,请发邮件给老师。',
    fq4: '可以发链接吗?', fa4: '可以--用 Links 板块并填写 http(s) 网址。',
    fq5: '谁能看我的主页?', fa5: '任何登录的同学。游客只能浏览。',
    gTitle: '社区准则', g1: '互相尊重。禁止霸凌、骚扰或仇恨言论。', g2: '不得发布他人真名或个人信息。',
    g3: '不安全或自伤内容会被拦截;如遇危机,请发邮件给老师。', g4: '被举报内容由管理员复核。',
    messages: '私信', newChat: '新建聊天', matches: '匹配', shared: '共同兴趣', startChat: '聊天',
    composeMsg: '输入消息…', noConv: '还没有会话。从“找朋友”或“新建聊天”开始。', typeName: '搜索昵称', search: '搜索',
    blocked: '你的内容被安全过滤拦截了。', crisis: '如遇危机，请发邮件给老师。',
    findFriends: '找朋友', groups: '群组', join: '加入', leave: '退出', createGroup: '新建群组', groupName: '群组名称', groupDesc: '简介（可选）', newGroup: '新建群组', members: '人', online: '在线', searchPeople: '搜名字或兴趣（如：吉他）', msg: '发消息', viewProfile: '主页', allGroups: '全部群组', myGroups: '我的群组', noPeople: '还没人匹配——换个词试试。', noGroups: '还没有群组。', promote: '升为版主', promoteAdmin: '升为管理员', demote: '降级', unban: '解除封禁', unmute: '解除禁言',
  }
};

const state = { token: null, me: null, settings: null, lang: 'en', boards: [] };

function t(k) { return (LANG[state.lang] && LANG[state.lang][k]) || LANG.en[k] || k; }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function timeAgo(ts) { const s = Math.floor((Date.now() - ts) / 1000); if (s < 60) return 'now'; if (s < 3600) return Math.floor(s / 60) + 'm'; if (s < 86400) return Math.floor(s / 3600) + 'h'; return Math.floor(s / 86400) + 'd'; }
function toast(m) { const el = document.createElement('div'); el.textContent = m; el.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#134e4a;color:#fff;padding:10px 16px;border-radius:10px;z-index:99'; document.body.appendChild(el); setTimeout(() => el.remove(), 2200); }
function boardName(b) { return state.lang === 'zh' && b.name_zh ? b.name_zh : b.name; }
function boardDesc(b) { return state.lang === 'zh' && b.desc_zh ? b.desc_zh : b.desc; }

async function api(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (state.token) headers['Authorization'] = 'Bearer ' + state.token;
  const r = await fetch(path, { method: opts.method || 'GET', headers, body: opts.body ? JSON.stringify(opts.body) : undefined });
  if (r.status === 401 && state.token) { state.token = null; localStorage.removeItem(LS); }
  let data; try { data = await r.json(); } catch { data = {}; }
  if (!r.ok) { const e = new Error(data.error || ('Error ' + r.status)); e.status = r.status; throw e; }
  return data;
}

// ---------- modal ----------
function openModal(html) { document.getElementById('modalBox').innerHTML = html; document.getElementById('modal').classList.remove('hidden'); }
function closeModal() { document.getElementById('modal').classList.add('hidden'); }

// ---------- school info ----------
function openSchoolInfo() {
  openModal(`<h3>🏫 ${t('schoolTitle')}</h3>
  <p><b>NEXUS International School (Singapore)</b></p>
  <p>1 Aljunied Walk, Singapore 387293</p>
  <p class="muted">A friendly community for every new student — and any student who wants to ask questions and meet people.</p>
  <div class="grid2">
    <div class="note"><b>Programmes</b><div class="muted">MYP · IGCSE · IBDP</div></div>
    <div class="note"><b>Learner Services</b><div class="muted">learnerservices@nexus.edu.sg</div></div>
    <div class="note"><b>School office</b><div class="muted">+65 6536 6566</div></div>
    <div class="note"><b>Website</b><div class="muted"><a href="https://www.nexus.edu.sg" target="_blank" rel="noopener">nexus.edu.sg</a></div></div>
  </div>
  <p class="muted">In a crisis, send an email to your teachers.</p>
  <button class="btn primary" onclick="NEXUS.closeModal()">${t('cancel')}</button>`);
}

// ---------- auth ----------
function openLogin() {
  openModal(`<h3>${t('signin')}</h3>
    <div style="display:flex;gap:8px;margin-bottom:10px">
      <button class="btn sm" id="tabLogin" onclick="NEXUS.showAuth('login')">${t('login')}</button>
      <button class="btn sm" id="tabSignup" onclick="NEXUS.showAuth('signup')">${t('signup')}</button>
    </div>
    <div id="authForm"></div>`);
  NEXUS.showAuth('login');
}
function showAuth(mode) {
  const f = document.getElementById('authForm');
  if (mode === 'login') {
    f.innerHTML = `<div class="field"><input id="em" placeholder="you@nexus.edu.sg"></div>
      <div class="field"><input id="pw" type="password" placeholder="${t('password')}"></div>
      <button class="btn primary" onclick="NEXUS.login()">${t('login')}</button>`;
  } else {
    f.innerHTML = `<div class="field"><input id="em" placeholder="you@nexus.edu.sg"></div>
      <div class="field"><input id="pw" type="password" placeholder="${t('password')} (≥6)"></div>
      <button class="btn primary" onclick="NEXUS.signup()">${t('signup')}</button>`;
  }
  document.getElementById('tabLogin').classList.toggle('primary', mode === 'login');
  document.getElementById('tabSignup').classList.toggle('primary', mode === 'signup');
}
async function login() {
  try {
    const r = await api('/api/auth/login', { method: 'POST', body: { email: document.getElementById('em').value.trim(), password: document.getElementById('pw').value } });
    afterAuth(r);
  } catch (e) { toast(e.message); }
}
async function signup() {
  try {
    const r = await api('/api/auth/signup', { method: 'POST', body: { email: document.getElementById('em').value.trim(), password: document.getElementById('pw').value } });
    afterAuth(r);
  } catch (e) { toast(e.message); }
}
function afterAuth(r) {
  state.token = r.token; localStorage.setItem(LS, r.token);
  if (r.needOnboard) return openOnboard();
  closeModal(); location.reload();
}
const AVATARS = ['🐱', '🦊', '🐼', '🐨', '🐯', '🦁', '🐸', '🐧', '🐰', '🐙'];
const PROGRAMMES = ['MYP', 'IGCSE', 'IBDP'];
function avatarPicker(current, onpick) {
  return `<div class="muted">${t('pickAvatar')}</div><div class="row wrap" style="margin-bottom:8px">${AVATARS.map(a => `<button class="btn sm ${a === current ? 'primary' : ''}" data-av="${a}" data-target="${onpick}">${a}</button>`).join('')}</div>`;
}
function programmeSelect(id, current) {
  return `<div class="field"><label>${t('programme')}</label><select id="${id}"><option value="">${t('noProgram')}</option>${PROGRAMMES.map(p => `<option ${p === current ? 'selected' : ''}>${p}</option>`).join('')}</select></div>`;
}
function bindAvatarPickers() {
  document.querySelectorAll('[data-av]').forEach(b => b.onclick = () => {
    const target = document.getElementById(b.getAttribute('data-target'));
    if (target) target.value = b.getAttribute('data-av');
    b.parentElement.querySelectorAll('[data-av]').forEach(x => x.classList.remove('primary'));
    b.classList.add('primary');
  });
}

function openOnboard() {
  openModal(`<h3>${t('profile')}</h3>
    <div class="grid2">
      <div class="field"><label>${t('realname')}</label><input id="o_real" placeholder="${t('realname')}"></div>
      <div class="field"><label>${t('hobby')}</label><input id="o_hobby" placeholder="${t('hobby')}"></div>
    </div>
    ${avatarPicker('🐱', 'o_avatar')}<input id="o_avatar" value="🐱" type="hidden">
    <div class="grid2">
      ${programmeSelect('o_prog', '')}
      <div class="field"><label>${t('interests')}</label><input id="o_int" placeholder="${t('interests')}"></div>
    </div>
    <div class="field"><label>${t('bio')}</label><textarea id="o_bio" placeholder="${t('bio')}"></textarea></div>
    <button class="btn primary" onclick="NEXUS.saveOnboard()">${t('save')}</button>`);
  bindAvatarPickers();
}
async function saveOnboard() {
  try {
    await api('/api/auth/onboard', { method: 'POST', body: { real_name: document.getElementById('o_real').value, avatar: document.getElementById('o_avatar').value, bio: document.getElementById('o_bio').value, hobby: document.getElementById('o_hobby').value, program: document.getElementById('o_prog').value, interests: document.getElementById('o_int').value.split(',').map(s => s.trim()).filter(Boolean) } });
    await api('/api/auth/accept-conduct', { method: 'POST' });
    await loadMe(); closeModal(); location.reload();
  } catch (e) { toast(e.message); }
}
async function loadMe() { try { state.me = await api('/api/me'); } catch (e) { state.token = null; localStorage.removeItem(LS); } }

// ---------- nav ----------
function closeMenu() { const m = document.getElementById('menu'); if (m) m.classList.add('hidden'); }
function toggleMenu() { const m = document.getElementById('menu'); if (m) m.classList.toggle('hidden'); }
function renderNav() {
  const menu = document.getElementById('menu');
  const boardLinks = state.boards.map(b => `<a class="mi" data-go="board/${b.id}">${boardName(b)}</a>`).join('');
  let html = `<a class="mi" data-go="home">${t('home')}</a>${boardLinks}<a class="mi" data-go="guidelines">${t('guidelines')}</a><a class="mi" data-go="faq">${t('faq')}</a><a class="mi" onclick="NEXUS.openSchoolInfo();NEXUS.closeMenu()">ℹ️ ${t('schoolInfo')}</a>`;
  if (state.me) {
    html += `<a class="mi" data-go="messages">${t('messages')}</a><a class="mi" data-go="people">${t('findFriends')}</a><a class="mi" data-go="groups">${t('groups')}</a><a class="mi" onclick="NEXUS.compose(null);NEXUS.closeMenu()">✏️ ${t('newPost')}</a>`;
    if (['admin', 'moderator'].includes(state.me.role)) html += `<a class="mi" data-go="admin">${t('admin')}</a>`;
    html += `<a class="mi" data-go="profile/me">${t('profile')}</a><a class="mi" onclick="NEXUS.openFeedback();NEXUS.closeMenu()">💬 ${t('feedback')}</a>`;
  }
  menu.innerHTML = html;
  let tg = document.getElementById('navToggle');
  if (!tg) { tg = document.createElement('button'); tg.id = 'navToggle'; tg.className = 'btn ghost sm'; tg.textContent = '☰'; tg.onclick = () => NEXUS.toggleMenu(); document.getElementById('right').prepend(tg); }
  const right = document.getElementById('authBtn');
  if (state.me) {
    right.textContent = t('signout'); right.onclick = async () => { await api('/api/auth/logout', { method: 'POST' }); state.token = null; state.me = null; localStorage.removeItem(LS); location.reload(); };
  } else { right.textContent = t('signin'); right.onclick = () => openLogin(); }
  bindGo();
}

// ---------- views ----------
async function viewHome() {
  const d = await api('/api/home');
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="guide">
      <b>🐱 ${t('welcome')}</b>
      <div class="gsec"><b>${t('gTitle')}</b> <span class="muted">${t('guidelinesNote')}</span></div>
      <ul class="glist"><li>${t('g1')}</li><li>${t('g2')}</li><li>${t('g3')}</li><li>${t('g4')}</li></ul>
    </div>
    ${state.me ? '' : `<div class="card muted">${t('signinToPost')}</div>`}
    <h3>${t('boards')}</h3>
    <div class="row wrap">${d.boards.map(b => `<div class="card" style="cursor:pointer;flex:1;min-width:200px" data-go="board/${b.id}"><b>${esc(boardName(b))}</b><div class="muted">${esc(boardDesc(b))}</div></div>`).join('')}</div>
    <h3>${t('schoolTitle')}</h3>
    <div class="card">
      <b>NEXUS International School (Singapore)</b>
      <div class="muted">1 Aljunied Walk, Singapore 387293</div>
      <div class="row wrap" style="margin-top:6px"><span class="pill">MYP</span><span class="pill">IGCSE</span><span class="pill">IBDP</span></div>
      <div class="row wrap" style="margin-top:10px">
        <button class="btn sm primary" onclick="NEXUS.openSchoolInfo()">ℹ️ ${t('schoolTitle')}</button>
        <a class="btn sm" href="#/board/links">🔗 ${t('links')}</a>
      </div>
    </div>`;
  bindGo();
}
async function viewBoard(id) {
  const b = state.boards.find(x => x.id === id) || {};
  const d = await api('/api/posts?board=' + id);
  document.getElementById('app').innerHTML = `
    <div class="row" style="margin-bottom:10px"><h2 style="margin:0">${esc(boardName(b))}</h2><button class="btn primary" onclick="NEXUS.compose('${id}')">${t('ask')}</button></div>
    ${boardDesc(b) ? `<div class="muted" style="margin-bottom:12px">${esc(boardDesc(b))}</div>` : ''}
    ${d.posts.length ? d.posts.map(postRow).join('') : '<div class="card muted">No posts yet - be the first!</div>'}`;
  bindGo();
}
function postRow(p) {
  const b = state.boards.find(x => x.id === p.board) || {};
  const name = b.id ? boardName(b) : 'Post';
  const visit = p.url ? `<a class="btn sm primary" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">${t('visit')}</a>` : '';
  const tags = [p.category, p.year, p.subject].filter(Boolean).map(x => `<span class="pill">${esc(x)}</span>`).join('');
  return `<div class="card" data-go="post/${p.id}" style="cursor:pointer">
    <div class="row"><span class="pill">${esc(name)}</span>${p.flagged ? '<span class="pill help">⚠ review</span>' : ''}<span class="muted">${timeAgo(p.created_at)} · 🤍 ${p.likes} · 💬 ${p.comments}</span></div>
    ${tags ? `<div>${tags}</div>` : ''}
    ${p.title ? `<b>${esc(p.title)}</b>` : ''}<div>${esc((p.body || '').slice(0, 180))}</div>${visit}</div>`;
}
async function viewPost(id) {
  const d = await api('/api/posts/' + id);
  const p = d.post;
  const tags = [p.category, p.year, p.subject].filter(Boolean).map(x => `<span class="pill">${esc(x)}</span>`).join('');
  const visit = p.url ? `<a class="btn primary" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${t('visit')}</a>` : '';
  document.getElementById('app').innerHTML = `
    <div class="card">
      <div class="row"><div class="av">${p.author ? p.author.avatar : '🐱'}</div><div><b>${esc(p.author ? p.author.nickname : '?')}</b> <span class="muted">${timeAgo(p.created_at)}</span></div></div>
      ${tags ? `<div>${tags}</div>` : ''}
      ${p.title ? `<h3>${esc(p.title)}</h3>` : ''}
      <div>${esc(p.body)}</div>${visit}
      <div class="row" style="margin-top:8px"><button class="btn sm" onclick="NEXUS.like('${p.id}')">🤍 ${p.likes}</button><button class="btn sm" onclick="NEXUS.report('post','${p.id}')">🚩</button></div>
    </div>
    <h3>${t('comments')} (${d.comments.length})</h3>
    ${state.me ? `<div class="card"><textarea id="c_body" placeholder="${t('postBody')}"></textarea><button class="btn primary sm" onclick="NEXUS.comment('${p.id}')">${t('send')}</button></div>` : `<div class="card muted">${t('signinToPost')}</div>`}
    ${d.comments.map(c => `<div class="card"><div class="row"><div class="av" style="width:30px;height:30px;font-size:16px">${c.avatar}</div><div><b>${esc(c.nickname)}</b>${c.verified ? ` <span class="pill help">${t('verified')}</span>` : ''} <span class="muted">${timeAgo(c.created_at)}</span></div></div><div>${esc(c.body)}</div><div class="row" style="margin-top:6px"><button class="btn sm" onclick="NEXUS.likeComment('${c.id}')">👍 ${c.likes}</button>${['admin', 'moderator'].includes(state.me && state.me.role) ? `<button class="btn sm" onclick="NEXUS.verifyComment('${c.id}')">✓ ${t('verified')}</button>` : ''}<button class="btn sm" onclick="NEXUS.report('comment','${c.id}')">🚩</button></div></div>`).join('')}`;
  bindGo();
}
async function viewProfile(uid) {
  if (!state.me) return redirectLogin();
  const target = uid === 'me' ? state.me.id : uid;
  const d = await api('/api/users/' + target);
  const u = d.user;
  document.getElementById('app').innerHTML = `
    <div class="card row" style="align-items:flex-start"><div class="av" style="width:54px;height:54px;font-size:30px">${u.avatar}</div>
      <div style="flex:1">
        <h2 style="margin:0">${esc(u.nickname)}</h2>
        <div class="row wrap" style="margin:4px 0">
          <span class="pill">${u.program ? esc(u.program) : t('noProgram')}</span>
          ${u.hobby ? `<span class="pill">${t('hobby')}: ${esc(u.hobby)}</span>` : ''}
        </div>
        <div class="muted">${esc(u.bio || '')}</div>
        <div>${(u.interests || []).map(i => `<span class="tag">${esc(i)}</span>`).join('')}</div>
      </div></div>
    <div class="row" style="margin-bottom:10px">${target === state.me.id ? `<button class="btn sm primary" onclick="NEXUS.editProfile()">✏️ ${t('edit')}</button>` : `<button class="btn sm primary" onclick="NEXUS.startChatWith('${u.id}')">💬 ${t('startChat')}</button>`}</div>
    <h3>${t('recent')}</h3>${d.posts.map(postRow).join('') || '<div class="muted">' + t('none') + '</div>'}`;
  bindGo();
}

// ---------- compose / actions ----------
function compose(board) {
  if (!state.me) return redirectLogin();
  if (!state.me.conductAccepted) return openConduct();
  const isLink = board === 'links';
  const boardSel = board
    ? `<input type="hidden" id="c_board" value="${board}"><div class="muted">${esc((state.boards.find(b => b.id === board) || {}).name || board)}</div>`
    : `<select id="c_board" onchange="NEXUS.compose(this.value)"><option value="">${t('boards')}...</option>${state.boards.map(b => `<option value="${b.id}">${boardName(b)}</option>`).join('')}</select>`;
  const qa = board === 'qa' ? `<select id="c_cat"><option value="">${t('cat')}...</option><option>Academic & Homework Support</option><option>School Life & Daily Routines</option><option>Social & School Community Integration</option><option>Language & Culture</option></select><select id="c_year"><option value="">${t('year')}...</option><option>All school</option><option>MYP</option><option>IGCSE</option><option>IBDP</option></select>` : '';
  const linkField = isLink ? `<div class="muted">${t('url')}</div><input id="c_url" placeholder="https://example.com">` : '';
  openModal(`<h3>${t('ask')}</h3>${boardSel}${qa}${linkField}<input id="c_title" placeholder="${t('postTitle')}"><textarea id="c_body" placeholder="${t('postBody')}"></textarea><div class="row"><button class="btn primary" onclick="NEXUS.sendPost()">${t('send')}</button><button class="btn" onclick="NEXUS.closeModal()">${t('cancel')}</button></div>`);
}
async function sendPost() {
  const board = document.getElementById('c_board') ? document.getElementById('c_board').value : (document.getElementById('c_url') ? 'links' : null);
  const title = document.getElementById('c_title').value;
  const body = document.getElementById('c_body').value;
  const url = document.getElementById('c_url') ? document.getElementById('c_url').value.trim() : '';
  const category = document.getElementById('c_cat') ? document.getElementById('c_cat').value : '';
  const year = document.getElementById('c_year') ? document.getElementById('c_year').value : '';
  const subject = document.getElementById('c_subject') ? document.getElementById('c_subject').value : '';
  try {
    const r = await api('/api/posts', { method: 'POST', body: { board, title, body, url, category, year, subject } });
    if (r.crisis) { toast(t('crisis')); return closeModal(); }
    if (r.blocked) { toast(t('blocked')); return closeModal(); }
    closeModal(); location.reload();
  } catch (e) { toast(e.message); }
}
async function like(id) { try { await api('/api/posts/' + id + '/like', { method: 'POST' }); location.reload(); } catch (e) { toast(e.message); } }
async function likeComment(id) { try { await api('/api/comments/' + id + '/like', { method: 'POST' }); location.reload(); } catch (e) { toast(e.message); } }
async function verifyComment(id) { try { await api('/api/comments/' + id + '/verify', { method: 'POST' }); location.reload(); } catch (e) { toast(e.message); } }
async function comment(id) {
  const body = document.getElementById('c_body').value;
  try { const r = await api('/api/posts/' + id + '/comments', { method: 'POST', body: { body } }); if (r.crisis) toast(t('crisis')); else if (r.blocked) toast(t('blocked')); else location.reload(); } catch (e) { toast(e.message); }
}
function report(kind, id) { openModal(`<h3>🚩 ${t('report')}</h3><select id="r_reason"><option>Bullying</option><option>Inappropriate</option><option>Spam/Ad</option><option>Other</option></select><input id="r_note" placeholder="${t('reason')}"><div class="row"><button class="btn primary" onclick="NEXUS.sendReport('${kind}','${id}')">${t('submit')}</button><button class="btn" onclick="NEXUS.closeModal()">${t('cancel')}</button></div>`); }
async function sendReport(kind, id) { try { await api('/api/report', { method: 'POST', body: { kind, targetId: id, reason: document.getElementById('r_reason').value, note: document.getElementById('r_note').value } }); closeModal(); toast('Reported. Thank you.'); } catch (e) { toast(e.message); } }
function openConduct() { openModal(`<h3>${t('codTitle')}</h3><div class="guide">${t('g1')}<br>${t('g2')}<br>${t('g3')}<br>${t('g4')}</div><button class="btn primary" onclick="NEXUS.acceptConduct()">${t('accept')}</button>`); }
async function acceptConduct() { await api('/api/auth/accept-conduct', { method: 'POST' }); state.me.conductAccepted = true; closeModal(); compose(); }
function editProfile() {
  const m = state.me;
  openModal(`<h3>✏️ ${t('edit')}</h3>
    <div class="grid2">
      <div class="field"><label>${t('realname')}</label><input id="e_real" value="${esc(m.nickname || '')}"></div>
      <div class="field"><label>${t('hobby')}</label><input id="e_hobby" value="${esc(m.hobby || '')}" placeholder="e.g. basketball"></div>
    </div>
    ${avatarPicker(m.avatar || '🐱', 'e_avatar')}<input id="e_avatar" value="${esc(m.avatar || '🐱')}" type="hidden">
    <div class="grid2">
      ${programmeSelect('e_prog', m.program || '')}
      <div class="field"><label>${t('interests')}</label><input id="e_int" value="${esc((m.interests || []).join(', '))}"></div>
    </div>
    <div class="field"><label>${t('bio')}</label><textarea id="e_bio">${esc(m.bio || '')}</textarea></div>
    <div class="row"><button class="btn primary" onclick="NEXUS.saveProfile()">${t('save')}</button><button class="btn" onclick="NEXUS.closeModal()">${t('cancel')}</button></div>`);
  bindAvatarPickers();
}
async function saveProfile() {
  try {
    const r = await api('/api/me', { method: 'PATCH', body: {
      real_name: document.getElementById('e_real').value.trim(),
      avatar: document.getElementById('e_avatar').value,
      hobby: document.getElementById('e_hobby').value.trim(),
      program: document.getElementById('e_prog').value,
      bio: document.getElementById('e_bio').value,
      interests: document.getElementById('e_int').value.split(',').map(s => s.trim()).filter(Boolean)
    } });
    state.me = r.user || state.me;
    closeModal(); toast(t('saved')); router();
  } catch (e) { toast(e.message); }
}

// ---------- chat ----------
let chatTimer = null;
async function viewMessages() {
  if (!state.me) return redirectLogin();
  stopChatPoll();
  const [conv, ppl] = await Promise.all([api('/api/conversations'), api('/api/people')]);
  const dmByUser = {};
  const groups = [];
  for (const c of conv.conversations) {
    if (c.type === 'dm') {
      const other = c.members.find(m => m.id !== state.me.id) || c.members[0];
      if (other) dmByUser[other.id] = c;
    } else groups.push(c);
  }
  const people = ppl.people.slice();
  for (const c of conv.conversations) {
    if (c.type !== 'dm') continue;
    const other = c.members.find(m => m.id !== state.me.id) || c.members[0];
    if (other && !people.some(p => p.id === other.id)) people.push({ id: other.id, nickname: other.nickname, avatar: other.avatar });
  }
  const friendRows = people.map(u => {
    const c = dmByUser[u.id];
    const sub = c && c.last
      ? esc((c.last.body || '').slice(0, 42))
      : esc([u.program, u.hobby].filter(Boolean).join(' · ') || t('msgEmpty'));
    const when = c && c.last ? timeAgo(c.last.created_at) : '';
    return `<div class="chat-row" data-uid="${u.id}" data-cid="${c ? c.id : ''}">
      <div class="av">${u.avatar || '🐱'}</div>
      <div class="chat-row-main"><b>${esc(u.nickname)}</b><div class="chat-row-last muted">${sub}</div></div>
      <div class="chat-row-side muted">${when}</div>
    </div>`;
  }).join('');
  const groupRows = groups.map(c => {
    const sub = c.last ? esc((c.last.body || '').slice(0, 42)) : `<span class="muted">${t('msgEmpty')}</span>`;
    const when = c.last ? timeAgo(c.last.created_at) : '';
    return `<div class="chat-row" data-cid="${c.id}">
      <div class="av">👥</div>
      <div class="chat-row-main"><b>${esc(c.name || 'Group')}</b><div class="chat-row-last muted">${sub}</div></div>
      <div class="chat-row-side muted">${when}</div>
    </div>`;
  }).join('');
  document.getElementById('app').innerHTML = `
    <div class="chat-head"><h2>${t('messages')}</h2><button class="btn sm primary" onclick="NEXUS.newChat()">+ ${t('newChat')}</button></div>
    <div class="muted" style="margin:0 0 6px 2px">${t('findFriends')}</div>
    <div class="chat-list">${friendRows || `<div class="muted" style="padding:16px">${t('noPeople')}</div>`}</div>
    ${groupRows ? `<div class="muted" style="margin:14px 0 6px 2px">${t('groups')}</div><div class="chat-list">${groupRows}</div>` : ''}`;
  document.querySelectorAll('[data-uid]').forEach(el => el.onclick = () => openChatWith(el.getAttribute('data-uid'), el.getAttribute('data-cid')));
  document.querySelectorAll('[data-cid]:not([data-uid])').forEach(el => el.onclick = () => openChat(el.getAttribute('data-cid')));
}
async function openChatWith(uid, cid) {
  try {
    let id = cid;
    if (!id) { const r = await api('/api/conversations', { method: 'POST', body: { type: 'dm', memberIds: [uid] } }); id = r.id; }
    await openChat(id);
  } catch (e) { toast(e.message); }
}
async function openChat(cid) {
  if (!state.me) return redirectLogin();
  stopChatPoll();
  chatGroup = false;
  document.getElementById('app').innerHTML = `
    <div class="chat-head"><button class="btn sm" onclick="NEXUS.backToMessages()">← ${t('back')}</button><b id="chatTitle">${t('loading')}</b></div>
    <div class="chat-box" id="chatBox">${t('loading')}</div>
    <div class="chat-input"><input id="msgIn" placeholder="${t('composeMsg')}" onkeydown="if(event.key==='Enter'){event.preventDefault();NEXUS.sendMsg('${cid}')}"><button class="btn primary" onclick="NEXUS.sendMsg('${cid}')">${t('send')}</button></div>`;
  try {
    const meta = await api('/api/conversations/' + cid);
    const c = meta.conversation;
    chatGroup = c.type === 'group';
    const other = c.type === 'dm' ? (c.members.find(x => x.id !== state.me.id) || c.members[0]) : null;
    const title = c.type === 'dm' ? (other ? other.nickname : 'Chat') : (c.name || 'Group');
    const el = document.getElementById('chatTitle');
    if (el) el.textContent = c.type === 'group' ? `${title} · ${c.members.length}` : title;
  } catch (e) {}
  await pollChat(cid);
  startChatPoll(cid);
}
function backToMessages() { stopChatPoll(); location.hash = '#/messages'; viewMessages(); }

async function pollChat(cid) {
  try {
    const d = await api('/api/conversations/' + cid + '/messages');
    const box = document.getElementById('chatBox'); if (!box) return;
    box.innerHTML = d.messages.length ? d.messages.map(m => {
      const mine = m.user_id === state.me.id;
      const name = (!mine && chatGroup && m.nickname) ? `<div class="msg-name">${esc(m.nickname)}</div>` : '';
      return `<div class="msg-wrap${mine ? ' me' : ''}">${name}<div class="msg${mine ? ' me' : ''}">${esc(m.body)}</div><div class="msg-time">${timeAgo(m.created_at)}</div></div>`;
    }).join('') : `<div class="muted" style="padding:12px">${t('msgEmpty')}</div>`;
    box.scrollTop = box.scrollHeight;
  } catch (e) {}
}
function startChatPoll(cid) { stopChatPoll(); chatTimer = setInterval(() => pollChat(cid), 2500); }
function stopChatPoll() { if (chatTimer) clearInterval(chatTimer); chatTimer = null; }
async function sendMsg(cid) {
  const el = document.getElementById('msgIn'); const body = el.value.trim(); if (!body) return;
  try { const r = await api('/api/conversations/' + cid + '/messages', { method: 'POST', body: { body } }); if (r.crisis) toast(t('crisis')); else if (r.blocked) toast(t('blocked')); else { el.value = ''; await pollChat(cid); } } catch (e) { toast(e.message); }
}
let chatGroup = false;
async function newChat() {
  openModal(`<h3>${t('newChat')}</h3><input id="searchName" placeholder="${t('typeName')}" oninput="NEXUS.searchUser()"><div id="searchRes" style="margin-top:10px">${t('loading')}</div>`);
  await searchUser();
}
async function searchUser() {
  const el = document.getElementById('searchName');
  const res = document.getElementById('searchRes'); if (!res) return;
  const q = el ? el.value.trim() : '';
  try {
    const d = await api('/api/people' + (q ? '?q=' + encodeURIComponent(q) : ''));
    res.innerHTML = d.people.length ? d.people.slice(0, 30).map(m => `<div class="chat-row" onclick="NEXUS.startChatWith('${m.id}')">
      <div class="av">${m.avatar || '🐱'}</div>
      <div class="chat-row-main"><b>${esc(m.nickname)}</b><div class="chat-row-last muted">${esc(m.program || '')}${(m.shared && m.shared.length) ? ' · ' + t('shared') + ': ' + esc(m.shared.join(', ')) : (m.hobby ? ' · ' + esc(m.hobby) : '')}</div></div>
      <span class="btn sm primary">💬</span></div>`).join('') : `<div class="muted">${t('noPeople')}</div>`;
  } catch (e) { res.innerHTML = `<div class="muted">${esc(e.message)}</div>`; }
}
async function startChatWith(uid) { closeModal(); await openChatWith(uid, ''); }
async function viewMatches() { return viewFriends(); }

// ---------- find friends (people directory) ----------
async function viewFriends() {
  if (!state.me) return redirectLogin();
  document.getElementById('app').innerHTML = `<div class="chat-head"><h2 style="margin:0">${t('findFriends')}</h2></div>
    <div class="row" style="margin-bottom:12px"><input id="peopleQ" placeholder="${t('searchPeople')}" style="flex:1;padding:10px;border-radius:10px;border:1px solid var(--line)" oninput="NEXUS.searchPeople()">
    <button class="btn primary" onclick="NEXUS.searchPeople()">${t('search')}</button></div>
    <div id="peopleList" class="col">${t('loading')}</div>`;
  await loadPeople('');
}
async function loadPeople(q) {
  const box = document.getElementById('peopleList'); if (!box) return;
  try {
    const d = await api('/api/people' + (q ? '?q=' + encodeURIComponent(q) : ''));
    if (!d.people.length) { box.innerHTML = `<div class="muted">${t('noPeople')}</div>`; return; }
    box.innerHTML = d.people.map(u => `<div class="chat-row">
      <div class="av" style="cursor:pointer" onclick="location.hash='#/profile/${u.id}'">${u.avatar || '🙂'}</div>
      <div class="chat-row-main" style="cursor:pointer" onclick="location.hash='#/profile/${u.id}'">
        <b>${esc(u.nickname)}</b>${u.online ? ` <span class="pill">${t('online')}</span>` : ''}
        <div class="chat-row-last muted">${[u.program, u.hobby].filter(Boolean).map(esc).join(' · ')}${(u.interests || []).length ? (((u.program || u.hobby) ? ' · ' : '') + (u.interests || []).map(esc).join(' · ')) : ''}</div>
        ${(u.shared && u.shared.length) ? `<div class="chat-row-last"><span class="pill help">${t('shared')}: ${esc(u.shared.join(', '))}</span></div>` : ''}
      </div>
      <button class="btn sm primary" onclick="event.stopPropagation();NEXUS.startChatWith('${u.id}')">💬 ${t('msg')}</button>
    </div>`).join('');
  } catch (e) { box.innerHTML = `<div class="muted">${esc(e.message)}</div>`; }
}
async function searchPeople() { const el = document.getElementById('peopleQ'); await loadPeople(el ? el.value.trim() : ''); }

// ---------- groups ----------
async function viewGroups() {
  if (!state.me) return redirectLogin();
  document.getElementById('app').innerHTML = `<div class="chat-head"><h2 style="margin:0">${t('groups')}</h2><button class="btn sm primary" onclick="NEXUS.createGroup()">+ ${t('createGroup')}</button></div>
    <div id="groupList" class="chat-list">${t('loading')}</div>`;
  await loadGroups();
}
async function loadGroups() {
  const box = document.getElementById('groupList'); if (!box) return;
  try {
    const d = await api('/api/groups');
    if (!d.groups.length) { box.innerHTML = `<div class="muted" style="padding:16px">${t('noGroups')}</div>`; return; }
    box.innerHTML = d.groups.map(g => `<div class="chat-row">
      <div class="av" style="cursor:pointer" onclick="NEXUS.openChat('${g.id}')">👥</div>
      <div class="chat-row-main" style="cursor:pointer" onclick="NEXUS.openChat('${g.id}')">
        <b>${esc(g.name)}</b>${g.members ? ` <span class="pill">${g.members} ${t('memberCount')}</span>` : ''}
        <div class="chat-row-last muted">${esc(g.description || '')}</div>
      </div>
      <button class="btn sm ${g.joined ? '' : 'primary'}" onclick="event.stopPropagation();NEXUS.${g.joined ? 'leave' : 'join'}Group('${g.id}')">${g.joined ? '✓ ' + t('joined') : t('join')}</button>
    </div>`).join('');
  } catch (e) { box.innerHTML = `<div class="muted">${esc(e.message)}</div>`; }
}
async function joinGroup(id) { try { await api('/api/groups/' + id + '/join', { method: 'POST' }); toast(t('joined')); await openChat(id); } catch (e) { toast(e.message); } }
async function leaveGroup(id) { try { await api('/api/groups/' + id + '/leave', { method: 'POST' }); await loadGroups(); } catch (e) { toast(e.message); } }
async function createGroup() {
  const name = prompt(t('groupName')); if (!name) return;
  const desc = prompt(t('groupDesc') || '');
  try { const r = await api('/api/groups', { method: 'POST', body: { name, description: desc || '' } }); location.hash = '#/messages'; openChat(r.id); } catch (e) { toast(e.message); }
}

// ---------- admin ----------
async function viewAdmin(tab) {
  if (!state.me || !['admin', 'moderator'].includes(state.me.role)) return redirectLogin();
  tab = tab || 'reports';
  const [rep, us, st] = await Promise.all([
    api('/api/admin/reports').catch(() => ({ reports: [] })),
    api('/api/admin/users').catch(() => ({ users: [] })),
    api('/api/admin/stats').catch(() => ({}))
  ]);
  const tabs = [['reports', t('tabReports')], ['users', t('tabUsers')], ['mod', t('tabMod')], ['feedback', t('tabFeedback')], ['links', t('links')]];
  let body = '';
  if (tab === 'reports') body = adminReports(rep.reports || []);
  else if (tab === 'users') body = adminUsers(us.users || []);
  else if (tab === 'mod') body = await adminMod();
  else if (tab === 'feedback') body = await adminFeedback();
  else if (tab === 'links') body = await adminLinks();
  document.getElementById('app').innerHTML = `
    <h2>🛡️ ${t('admin')}</h2>
    <div class="card row wrap"><span class="pill">users ${st.users || 0}</span><span class="pill">posts ${st.posts || 0}</span><span class="pill">comments ${st.comments || 0}</span><span class="pill help">${t('openReports')} ${st.openReports || 0}</span><span class="pill help">review ${st.flagged || 0}</span><span class="pill help">feedback ${st.openFeedback || 0}</span><button class="btn sm" onclick="NEXUS.downloadBackup()">${t('backup')}</button></div>
    <div class="tabs">${tabs.map(([id, label]) => `<a class="btn sm ${tab === id ? 'primary' : 'ghost'}" data-go="admin/${id}">${label}</a>`).join('')}</div>
    <div id="adminBody">${body}</div>`;
  bindGo();
}
// 下载一份数据库快照（后悔药）
async function downloadBackup() {
  try {
    const headers = {};
    if (state.token) headers['Authorization'] = 'Bearer ' + state.token;
    const r = await fetch('/api/admin/backup', { headers });
    if (!r.ok) { const d = await r.json().catch(() => ({})); toast(d.error || 'Backup failed'); return; }
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nexus-backup-' + new Date().toISOString().slice(0, 10) + '.db';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast(t('backupDone'));
  } catch (e) { toast('Backup failed: ' + e.message); }
}
function adminReports(reports) {
  if (!reports.length) return '<div class="muted">No open reports</div>';
  return reports.map(r => `<div class="report-row"><b>${r.kind}</b> · ${esc(r.reason)}<div class="muted">${esc(r.note || '')}</div>${r.target ? `<div class="card muted" style="margin-top:6px">${esc((r.target.title || r.target.body || '').slice(0, 120))}</div>` : ''}<div class="actions"><button class="btn sm" onclick="NEXUS.handleReport('${r.id}','${r.target_type}','${r.target_id}',true)">${t('resolve')} + ${t('remove')}</button><button class="btn sm" onclick="NEXUS.handleReport('${r.id}','${r.target_type}','${r.target_id}',false)">${t('dismiss')}</button>${r.author_id ? `<button class="btn sm" onclick="NEXUS.warnUser('${r.author_id}')">⚠ ${t('warn')}</button>` : ''}</div></div>`).join('');
}
function adminUsers(users) {
  const me = state.me;
  const isTopAdmin = me && me.role === 'admin';
  return `<div class="card">${users.map(u => {
    const isSelf = u.id === me.id;
    const actions = [];
    actions.push(`<button class="btn sm" onclick="NEXUS.warnUser('${u.id}')">⚠ ${t('warn')}</button>`);
    if (u.status === 'active') actions.push(`<button class="btn sm" onclick="NEXUS.punish('${u.id}','mute')">${t('mute')}</button>`);
    else if (u.status === 'muted') actions.push(`<button class="btn sm" onclick="NEXUS.punish('${u.id}','unmute')">${t('unmute')}</button>`);
    if (u.status !== 'banned') actions.push(`<button class="btn sm danger" onclick="NEXUS.punish('${u.id}','ban')">${t('ban')}</button>`);
    else actions.push(`<button class="btn sm" onclick="NEXUS.punish('${u.id}','unban')">${t('unban')}</button>`);
    if (u.role === 'student') actions.push(`<button class="btn sm" onclick="NEXUS.punish('${u.id}','promote')">${t('promote')}</button>`);
    if (isTopAdmin && u.role === 'moderator') actions.push(`<button class="btn sm" onclick="NEXUS.punish('${u.id}','promote-admin')">${t('promoteAdmin')}</button>`);
    if (isTopAdmin && u.role !== 'student' && !isSelf) actions.push(`<button class="btn sm warn" onclick="NEXUS.punish('${u.id}','demote')">${t('demote')}</button>`);
    return `<div class="row" style="justify-content:space-between"><span>${u.avatar} <b>${esc(u.nickname)}</b> <span class="muted">${esc(u.email || '')}</span> <span class="pill">${u.role}</span>${u.status !== 'active' ? `<span class="pill help">${esc(u.status)}</span>` : ''}${u.warnings ? `<span class="pill help">${u.warnings} ${t('warnings')}</span>` : ''}</span><span class="actions">${actions.join('')}</span></div>`;
  }).join('')}</div>`;
}
async function adminMod() {
  const d = await api('/api/admin/modqueue').catch(() => ({ posts: [], comments: [] }));
  let html = '';
  if (d.posts.length) html += '<h4>Posts</h4>' + d.posts.map(p => `<div class="report-row"><b>${esc(p.board)}</b> ${esc((p.title || p.body || '').slice(0, 120))}<div class="actions"><button class="btn sm" onclick="NEXUS.adminDelete('post','${p.id}')">${t('remove')}</button></div></div>`).join('');
  if (d.comments.length) html += '<h4>Comments</h4>' + d.comments.map(c => `<div class="report-row">${esc((c.body || '').slice(0, 120))}<div class="actions"><button class="btn sm" onclick="NEXUS.adminDelete('comment','${c.id}')">${t('remove')}</button></div></div>`).join('');
  return html || '<div class="muted">Nothing to review</div>';
}
async function adminFeedback() {
  const d = await api('/api/admin/feedback').catch(() => ({ feedback: [] }));
  return d.feedback.length ? d.feedback.map(f => `<div class="report-row"><span class="pill">${esc(f.type)}</span> ${esc(f.nickname || 'guest')} <span class="muted">${timeAgo(f.created_at)}</span><div>${esc(f.body)}</div></div>`).join('') : '<div class="muted">No feedback yet</div>';
}
async function adminLinks() {
  const d = await api('/api/admin/links').catch(() => ({ links: [] }));
  const list = d.links.length ? d.links.map(l => `<div class="report-row"><b>${esc(l.title || l.url)}</b> <span class="muted">${esc(l.author || '')} · ${esc(l.url)}</span><div class="actions"><a class="btn sm primary" href="${esc(l.url)}" target="_blank" rel="noopener">${t('visit')}</a><button class="btn sm" onclick="NEXUS.adminDeleteLink('${l.id}')">${t('remove')}</button></div></div>`).join('') : '<div class="muted">No links yet</div>';
  return `<div class="row" style="margin-bottom:10px"><button class="btn primary sm" onclick="NEXUS.addLink()">+ ${t('links')}</button></div>${list}`;
}
async function addLink() {
  const title = prompt('Link title'); if (title === null) return;
  const url = prompt('URL (https://…)'); if (!url) return;
  try { await api('/api/admin/links', { method: 'POST', body: { title, url } }); toast('Added'); location.reload(); } catch (e) { toast(e.message); }
}
async function adminDeleteLink(id) { if (!confirm('Delete?')) return; try { await api('/api/admin/links/' + id, { method: 'DELETE' }); toast('Deleted'); location.reload(); } catch (e) { toast(e.message); } }
async function handleReport(id, kind, tid, remove) { await api('/api/admin/reports/' + id, { method: 'POST', body: { action: 'resolve', kind, targetId: tid, removeTarget: remove } }); toast('Done'); location.reload(); }
async function warnUser(id) { const r = prompt(t('warnReason')); if (r === null) return; await api('/api/admin/users/' + id, { method: 'POST', body: { action: 'warn', reason: r || '' } }); toast('Warned'); location.reload(); }
async function punish(id, action) { await api('/api/admin/users/' + id, { method: 'POST', body: { action } }); toast('Done'); location.reload(); }
async function adminDelete(kind, id) { if (!confirm('Delete?')) return; const r = await api('/api/admin/reports/x', { method: 'POST', body: {} }).catch(() => ({})); await api(kind === 'post' ? '/api/posts/' + id : '/api/comments/' + id, { method: 'DELETE' }); toast('Deleted'); location.reload(); }

// ---------- FAQ / Guidelines / Feedback ----------
async function viewFaq() {
  document.getElementById('app').innerHTML = `<h2>${t('faqTitle')}</h2>` +
    ['fq1', 'fa2', 'fa3', 'fa4', 'fa5'].map((k, i) => `<div class="card"><b>${t('fq' + (i + 1))}</b><div class="muted">${t('fa' + (i + 1))}</div></div>`).join('');
  bindGo();
}
async function viewGuidelines() {
  document.getElementById('app').innerHTML = `<h2>${t('gTitle')}</h2><div class="guide">${t('g1')}<br>${t('g2')}<br>${t('g3')}<br>${t('g4')}</div>`;
  bindGo();
}
function openFeedback() {
  if (!state.me) return redirectLogin();
  openModal(`<h3>💬 ${t('feedback')}</h3><select id="f_type"><option>General</option><option>Bug</option><option>Suggestion</option></select><textarea id="f_body" placeholder="..."></textarea><div class="row"><button class="btn primary" onclick="NEXUS.sendFeedback()">${t('send')}</button><button class="btn" onclick="NEXUS.closeModal()">${t('cancel')}</button></div>`);
}
async function sendFeedback() { try { await api('/api/feedback', { method: 'POST', body: { type: document.getElementById('f_type').value, body: document.getElementById('f_body').value } }); closeModal(); toast('Thanks!'); } catch (e) { toast(e.message); } }

// ---------- router ----------
function redirectLogin() { openLogin(); }
function bindGo() { document.querySelectorAll('[data-go]').forEach(el => { el.onclick = () => { location.hash = '#/' + el.getAttribute('data-go'); }; }); }
async function router() {
  const h = location.hash.replace(/^#\//, '') || 'home';
  const [view, param] = h.split('/');
  try {
    if (view === 'home') await viewHome();
    else if (view === 'board') await viewBoard(param);
    else if (view === 'post') await viewPost(param);
    else if (view === 'profile') await viewProfile(param);
    else if (view === 'messages') await viewMessages();
    else if (view === 'people') await viewFriends();
    else if (view === 'groups') await viewGroups();
    else if (view === 'matches') await viewFriends();
    else if (view === 'admin') await viewAdmin(param);
    else if (view === 'faq') await viewFaq();
    else if (view === 'guidelines') await viewGuidelines();
    else await viewHome();
  } catch (e) { document.getElementById('app').innerHTML = `<div class="card">⚠️ ${esc(e.message)}</div>`; }
  window.scrollTo(0, 0);
}
async function boot() {
  state.settings = await api('/api/settings');
  try { state.boards = (await api('/api/boards')).boards || []; } catch (_) { state.boards = []; }
  document.getElementById('sitename').textContent = state.settings.siteName;
  const langSel = document.getElementById('lang');
  langSel.innerHTML = Object.keys(LANG).map(l => `<option value="${l}">${l === 'en' ? 'English' : '中文'}</option>`).join('');
  langSel.value = state.lang;
  langSel.onchange = () => { state.lang = langSel.value; try { localStorage.setItem('nexus_lang', state.lang); } catch (_) {} location.reload(); };
  if (state.token) await loadMe();
  if (state.me && state.me.needOnboard) openOnboard();
  renderNav();
  window.addEventListener('hashchange', () => { closeMenu(); router(); });
  document.addEventListener('click', e => { const m = document.getElementById('menu'); const tg = document.getElementById('navToggle'); if (!m) return; if (m.contains(e.target) || (tg && tg.contains(e.target))) return; m.classList.add('hidden'); });
  await router();
}

window.NEXUS = { login, signup, showAuth, saveOnboard, compose, sendPost, like, likeComment, verifyComment, comment, report, sendReport, acceptConduct, editProfile, saveProfile, openFeedback, sendFeedback, openModal, closeModal, openSchoolInfo, openLogin, toggleMenu, closeMenu, warnUser, punish, handleReport, adminDelete, startChatWith, newChat, searchUser, sendMsg, searchPeople, joinGroup, leaveGroup, createGroup, addLink, adminDeleteLink, backToMessages, openChat, openChatWith, downloadBackup };
document.getElementById('modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
state.lang = 'en'; // 默认全英文;顶部语言选择器可切到中文;不读取旧 localStorage 以免意外显示中文
state.token = (() => { try { return localStorage.getItem(LS); } catch (_) { return null; } })();
boot();
