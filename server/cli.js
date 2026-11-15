'use strict';
// 用法：node server/cli.js promote <email> [admin|moderator]
const { db } = require('./db');
const [, , action, email, role] = process.argv;
if (action !== 'promote' || !email) { console.log('Usage: node server/cli.js promote <email> [admin|moderator]'); process.exit(1); }
const u = db.prepare('SELECT * FROM users WHERE email=?').get(email);
if (!u) { console.log('No such user. They must sign in once first.'); process.exit(1); }
db.prepare('UPDATE users SET role=? WHERE id=?').run(role === 'admin' ? 'admin' : 'moderator', u.id);
console.log(`✅ ${email} → ${role === 'admin' ? 'admin' : 'moderator'}`);
