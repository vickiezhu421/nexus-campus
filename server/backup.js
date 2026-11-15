'use strict';
// 数据库备份 / 还原（命令行）
//
//   node server/backup.js              → 生成一份带时间戳的快照到 data/backup/
//   node server/backup.js restore <文件>  → 用快照覆盖当前数据库（会先自动备份当前库）
//
// 快照用 SQLite 的 VACUUM INTO 生成，WAL 模式下也能得到一致的文件。

const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const DATA = path.join(__dirname, '..', 'data');
const DB = path.join(DATA, 'nexus.db');
const BACKUP = path.join(DATA, 'backup');

function stamp() {
  return new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
}
function ensureDirs() {
  fs.mkdirSync(DATA, { recursive: true });
  fs.mkdirSync(BACKUP, { recursive: true });
}

// 生成快照
function makeBackup(outFile) {
  ensureDirs();
  const db = new DatabaseSync(DB, { readOnly: true });
  try {
    db.exec("VACUUM INTO '" + outFile.replace(/'/g, "''") + "'");
  } finally {
    db.close();
  }
  const size = fs.statSync(outFile).size;
  console.log('✅ 备份完成:', outFile, '(' + (size / 1024).toFixed(1) + ' KB)');
  return outFile;
}

// 用快照覆盖当前库
function restore(file) {
  if (!fs.existsSync(file)) { console.error('❌ 文件不存在:', file); process.exit(1); }
  ensureDirs();
  // 先备份当前库，避免误操作无法挽回
  const safety = path.join(BACKUP, 'before-restore-' + stamp() + '.db');
  if (fs.existsSync(DB)) makeBackup(safety);
  // 关掉 WAL 附属文件，否则旧数据会残留
  for (const suffix of ['-wal', '-shm']) {
    const f = DB + suffix;
    if (fs.existsSync(f)) fs.unlinkSync(f);
  }
  fs.copyFileSync(file, DB);
  console.log('✅ 已还原:', file, '→', DB);
  if (safety) console.log('   (还原前的旧库已存为:', safety + ')');
}

const [, , action, file] = process.argv;
if (action === 'restore') {
  if (!file) { console.error('用法: node server/backup.js restore <备份文件路径>'); process.exit(1); }
  restore(path.resolve(file));
} else {
  makeBackup(path.join(BACKUP, 'nexus-' + stamp() + '.db'));
}
