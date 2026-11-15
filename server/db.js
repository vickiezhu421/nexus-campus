const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'nexus.db');
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL;');

// migrations for columns added after first release
try { db.exec("ALTER TABLE conversations ADD COLUMN description TEXT NOT NULL DEFAULT ''"); } catch (_) {}
try { db.exec('ALTER TABLE users ADD COLUMN last_seen INTEGER NOT NULL DEFAULT 0'); } catch (_) {}
try { db.exec("ALTER TABLE users ADD COLUMN hobby TEXT NOT NULL DEFAULT ''"); } catch (_) {}
try { db.exec("ALTER TABLE users ADD COLUMN program TEXT NOT NULL DEFAULT ''"); } catch (_) {}
try { db.exec("ALTER TABLE users ADD COLUMN password TEXT NOT NULL DEFAULT ''"); } catch (_) {}
try { db.exec("ALTER TABLE users ADD COLUMN real_name TEXT NOT NULL DEFAULT ''"); } catch (_) {}

db.exec(`
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  siteName TEXT NOT NULL,
  defaultLang TEXT NOT NULL,
  schoolDomain TEXT NOT NULL,
  devMode INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nickname TEXT UNIQUE NOT NULL,
  avatar TEXT NOT NULL DEFAULT '🐱',
  bio TEXT NOT NULL DEFAULT '',
  interests TEXT NOT NULL DEFAULT '[]',
  role TEXT NOT NULL DEFAULT 'student',
  status TEXT NOT NULL DEFAULT 'active',
  muted_until INTEGER NOT NULL DEFAULT 0,
  warnings INTEGER NOT NULL DEFAULT 0,
  conductAccepted INTEGER NOT NULL DEFAULT 0,
  needOnboard INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS login_codes (
  email TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS boards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  desc TEXT NOT NULL DEFAULT '',
  desc_zh TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  board TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  image TEXT,
  url TEXT,
  category TEXT,
  year TEXT,
  subject TEXT,
  pinned INTEGER NOT NULL DEFAULT 0,
  flagged INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  comments INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  body TEXT NOT NULL,
  verified INTEGER NOT NULL DEFAULT 0,
  flagged INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS post_likes (user_id TEXT NOT NULL, post_id TEXT NOT NULL, PRIMARY KEY (user_id, post_id));
CREATE TABLE IF NOT EXISTS comment_likes (user_id TEXT NOT NULL, comment_id TEXT NOT NULL, PRIMARY KEY (user_id, comment_id));
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  target_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  reason TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  reporter_id TEXT,
  author_id TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS user_warnings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  type TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS conversation_members (
  conversation_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  PRIMARY KEY (conversation_id, user_id)
);
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
`);

// ---- seed settings + boards ----
function seed() {
  const s = db.prepare('SELECT id FROM settings WHERE id = 1').get();
  if (!s) {
    db.prepare('INSERT INTO settings (id, siteName, defaultLang, schoolDomain, devMode) VALUES (1, ?, ?, ?, ?)')
      .run('NEXUS', 'en', 'nexus.edu.sg', 1);
  }
  const boards = [
    ['qa', 'Q&A', '问答', 'Ask anything about school life and studies.', '在校园生活与学习上自由提问。'],
    ['links', 'Links', '链接', 'Useful external websites — click through to learn more.', '有用的外部网站——点过去了解更多。'],
    ['advice', 'Advice From Learners', '学长学姐建议', 'Tips and advice shared by senior students.', '高年级同学分享的经验与建议。']
  ];
  const ins = db.prepare('INSERT OR IGNORE INTO boards (id, name, name_zh, desc, desc_zh) VALUES (?, ?, ?, ?, ?)');
  for (const b of boards) ins.run(...b);

  // removed features: Study Group board + Meet New People board (merged into Find Friends)
  const deadPosts = db.prepare("SELECT id FROM posts WHERE board IN ('study','meet')").all();
  for (const p of deadPosts) db.prepare('DELETE FROM comments WHERE post_id = ?').run(p.id);
  db.prepare("DELETE FROM posts WHERE board IN ('study','meet')").run();
  db.prepare("DELETE FROM boards WHERE id IN ('study','meet')").run();

  // seed the four official school links on the Links board (editable in Admin > Links)
  const seedLinks = [
    ['seedlink-sams', 'Learner-based school information portal', 'SAMS Learner Portal — your learner-based school information portal.', 'https://nexus.isams.cloud'],
    ['seedlink-bulletin', 'Learner Bulletin', 'School announcements, notices and learner forms.', 'https://sites.google.com/nexus.edu.sg/learnerbulletin'],
    ['seedlink-canvas', 'Canvas Support Center', 'Have a question about Canvas? Ask it here.', 'https://canvas.nexus.edu.sg'],
    ['seedlink-buddy', 'Nexus International School SchoolsBuddy Portal', 'Selecting CCA — sign up and manage your activities.', 'https://www.schoolsbuddy.com']
  ];
  const hasLink = db.prepare('SELECT 1 FROM posts WHERE id = ?');
  const insLink = db.prepare("INSERT INTO posts (id, user_id, board, title, body, url, created_at) VALUES (?, 'system', 'links', ?, ?, ?, ?)");
  const t0 = Date.now();
  seedLinks.forEach(([id, title, body, url], i) => {
    if (!hasLink.get(id)) insLink.run(id, title, body, url, t0 + i);
  });
  // seed the three programme groups (joinable by anyone)
  const gcount = db.prepare("SELECT COUNT(*) AS c FROM conversations WHERE type = 'group'").get().c;
  if (gcount === 0) {
    const gins = db.prepare("INSERT INTO conversations (id, type, name, description, created_by, created_at) VALUES (?, 'group', ?, ?, 'system', ?)");
    const now = Date.now();
    const seedGroups = [
      ['IBDP', 'IB Diploma Programme — share subjects, IA & EE tips, exam prep.'],
      ['MYP', 'Middle Years Programme — coursework, eAssessment and project help.'],
      ['IGCSE', 'IGCSE — subject choices, past papers and revision buddies.']
    ];
    for (const [name, desc] of seedGroups) gins.run('grp-' + name.toLowerCase(), name, desc, now);
  }
}
seed();

module.exports = { db };
