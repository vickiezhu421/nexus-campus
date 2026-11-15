'use strict';
// 屏蔽词引擎：双层（前端提示 + 后端权威拦截）。
// 处理 1) 多语言 2) 变体（leet/空格/重复字母）3) 词边界 + 白名单（避免 Scunthorpe 误伤）4) 危机词识别
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, 'words');

const cat = { profanity: new Set(), bullying: new Set(), selfharm: new Set(), slur: new Set(), local: new Set() };
function load(file, set) {
  try {
    const txt = fs.readFileSync(path.join(DIR, file), 'utf8');
    for (const line of txt.split(/\r?\n/)) {
      const w = line.trim().toLowerCase();
      if (w && !w.startsWith('#')) set.add(w);
    }
  } catch (_) { /* 文件缺失可忽略 */ }
}

// 只加载站点实际使用的语言（settings.languages = en/zh）。
// 之前加载 14 种 LDNOOBW 语言，小语种脏话（如印地语 tatte）会撞英文子串，
// 导致正常英文句子被误拦；Singlish/福建/马来等本地脏话由 local.txt 单独覆盖。
['en', 'zh'].forEach(l => load(`${l}.txt`, cat.profanity));
// 自定义分类
load('bullying.txt', cat.bullying);
load('selfharm.txt', cat.selfharm);
load('slur.txt', cat.slur);
load('local.txt', cat.local);

const ALL = new Set([...cat.profanity, ...cat.bullying, ...cat.selfharm, ...cat.slur, ...cat.local]);
// 危机词（命中 → 弹求助资源，不只是拦截）
const CRISIS = new Set([...cat.selfharm]);
// 危机短语用 compact 形式直接匹配（避免空格绕过）
const CRISIS_PHRASES = new Set([
  'killyourself','killyou','killurself','kys','kms','suicide','suicidal',
  'selfharm','hangyourself','killmyself','cutmyself','wannadie','wanttodie'
]);

// 无辜词白名单（防止误伤：class/pass/grass/cocktail/analysis/grape/therapist...）
const WHITELIST = new Set(('class pass grass cocktail peacock analysis analyst graham grape grapes therapy therapist ' +
  'passport bass moss essay associate assessment assign assignment assistant mass brass crass lass sass octopus ' +
  'espouse asparagus morass bassinet classic passive compass glass classify passable classy passim massif ' +
  'assess asset assets assistance assemble assembly bassoon chassis classic classics glassy passably surpass assassin').split(' '));

const LEET = { '4':'a','@':'a','1':'i','!':'i','3':'e','8':'b','0':'o','5':'s','7':'t','$':'s','9':'g','6':'g','2':'z' };
const CJK = /[぀-ヿ가-힣一-鿿]/;

// 空格绕过检测：每个字母之间允许空格（\s*），但要求整段前后是非字母（词边界），
// 这样 “f u c k” 会被拦，而 “was stupid”（as+s 跨词）不会被误判成 ass。
const SPACED = [];
for (const w of ALL) {
  if (w.length >= 3 && w.length <= 9) SPACED.push({ w, re: new RegExp('(^|[^a-z0-9])' + w.split('').join('\\s*') + '([^a-z0-9]|$)', 'i') });
}

function normalizeToken(t) {
  let s = t.toLowerCase().split('').map(c => LEET[c] || c).join('');
  return s.replace(/(.)\1+/g, '$1'); // 折叠重复字母 fuuuck -> fuck
}
function collapse(text) { return text.toLowerCase().replace(/[^a-z0-90-9一-鿿぀-ヿ가-힣]/g, ''); }
function boundary(compact, start, end) {
  const b = start > 0 ? compact[start - 1] : '';
  const a = end < compact.length ? compact[end] : '';
  // 词前必须非字母（避免 scunthorpe）；词后若为字母则仅当词长>=4放行（避免误伤 classic 同时放行 "fuck this"）
  return (!/[a-z0-9]/.test(b)) && (!/[a-z0-9]/.test(a) || (end - start) >= 4);
}
function classify(word, hits) {
  if (cat.profanity.has(word)) hits.profanity.add(word);
  if (cat.bullying.has(word)) hits.bullying.add(word);
  if (cat.selfharm.has(word)) hits.selfharm.add(word);
  if (cat.slur.has(word)) hits.slur.add(word);
  if (cat.local.has(word)) hits.local.add(word);
}

function scan(text) {
  const hits = { profanity: new Set(), bullying: new Set(), selfharm: new Set(), slur: new Set(), local: new Set() };
  const crisis = new Set();
  if (!text) return done(hits, crisis);
  const compact = collapse(text);

  // 1) token 匹配（按词边界，天然避免 Scunthorpe）
  const tokens = text.toLowerCase().split(/[^a-z0-9一-鿿぀-ヿ가-힣]+/).filter(Boolean);
  for (const tok of tokens) {
    if (WHITELIST.has(tok)) continue;
    if (ALL.has(tok)) { classify(tok, hits); if (CRISIS.has(tok)) crisis.add(tok); }
    const nt = normalizeToken(tok);
    if (ALL.has(nt)) { classify(nt, hits); if (CRISIS.has(nt)) crisis.add(nt); }
  }

  // 2) compact 匹配（抓 f u c k / fuuuck / leet 变体）
  //    长短语(>=8)用子串匹配（误伤风险低，且能抓 "kill myself"）；短词(<=7)用词边界，避免 Scunthorpe 误伤
  for (const w of ALL) {
    if (w.length < 3 || w.length > 12) continue;
    if (WHITELIST.has(w)) continue;
    const cw = collapse(w);
    if (cw.length < 3) continue;
    if (cw.length >= 8) {
      if (compact.includes(cw)) { classify(w, hits); if (CRISIS.has(w)) crisis.add(w); }
    } else {
      // 短词（<=7）必须构成“完整单词”才拦截：匹配片段前后扩展到的整词 === 词本身。
      // 这样 analysis/title/assessment 等学术词永远不会误伤；单独写出的脏话或 f u c k（落在串尾）仍可拦截。
      let i = compact.indexOf(cw);
      while (i !== -1) {
        let s = i; while (s > 0 && /[a-z0-9]/i.test(compact[s - 1])) s--;
        let e = i + cw.length; while (e < compact.length && /[a-z0-9]/i.test(compact[e])) e++;
        if (compact.slice(s, e) === cw) { classify(w, hits); if (CRISIS.has(w)) crisis.add(w); }
        i = compact.indexOf(cw, i + 1);
      }
    }
  }
  // 3) 危机短语
  for (const p of CRISIS_PHRASES) {
    let i = compact.indexOf(p);
    while (i !== -1) { if (boundary(compact, i, i + p.length)) crisis.add(p); i = compact.indexOf(p, i + 1); }
  }
  // 4) 空格绕过（f u c k / k a n n i n a）：要求匹配片段内确实含有空格
  for (const { w, re } of SPACED) {
    const mm = re.exec(text);
    if (mm && /\s/.test(mm[0])) { classify(w, hits); if (CRISIS.has(w)) crisis.add(w); }
  }
  return done(hits, crisis);
}

function done(hits, crisis) {
  const out = {
    profanity: [...hits.profanity], bullying: [...hits.bullying],
    selfharm: [...hits.selfharm], slur: [...hits.slur], local: [...hits.local]
  };
  const words = [...new Set([...out.profanity, ...out.bullying, ...out.selfharm, ...out.slur, ...out.local])];
  const crisisWords = [...crisis];
  return {
    blocked: words.length > 0,
    crisis: crisisWords.length > 0,
    words,
    crisisWords,
    categories: out
  };
}

module.exports = { scan, ALL, cat };
