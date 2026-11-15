'use strict';
// 登录验证码邮件发送（通用 SMTP，QQ / 163 / Gmail / 学校邮箱都能用）
// 配置方式（环境变量，不要写进代码）：
//   SMTP_HOST=smtp.qq.com
//   SMTP_PORT=465        (465 用 SSL；587 用 STARTTLS)
//   SMTP_SECURE=1        (端口 465 时设为 1)
//   SMTP_USER=你的邮箱
//   SMTP_PASS=授权码 / 应用专用密码（不是登录密码！）
//   SMTP_FROM=NEXUS Campus <你的邮箱>   (可选)

// nodemailer 按需加载：邮件功能已停用（登录改为邮箱+密码），
// 顶层 require 会让缺依赖的环境直接启动失败，故改为真正要发信时才载入。
let nodemailer = null;

function getConfig() {
  const host = (process.env.SMTP_HOST || '').trim();
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();
  if (!host || !user || !pass) return null;
  const port = Number(process.env.SMTP_PORT || 587);
  return {
    host,
    port,
    secure: String(process.env.SMTP_SECURE || (port === 465 ? '1' : '0')) === '1',
    auth: { user, pass },
    from: (process.env.SMTP_FROM || user).trim()
  };
}

let transporter = null;
function getTransporter() {
  const cfg = getConfig();
  if (!cfg) return null;
  if (!transporter) {
    if (!nodemailer) nodemailer = require('nodemailer');
    transporter = nodemailer.createTransport(cfg);
  }
  return transporter;
}

// 是否已经配好邮件（前端/后台可用来提示"邮件服务未配置"）
function smtpConfigured() {
  return !!getConfig();
}

function buildCodeEmail(code, schoolDomain) {
  const text =
    `Your NEXUS Campus login code is ${code}\n\n` +
    `It expires in 10 minutes.\n` +
    `If you did not request this, just ignore this email.`;
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f6f8f8;font-family:-apple-system,system-ui,'Segoe UI',sans-serif">
  <div style="max-width:440px;margin:0 auto;background:#fff;border-radius:14px;padding:28px;box-shadow:0 2px 10px rgba(0,0,0,.06)">
    <div style="font-weight:700;font-size:18px;color:#0d9488;letter-spacing:.5px">NEXUS Campus</div>
    <p style="color:#5b6b6b;font-size:14px;margin:18px 0 6px">Your login code is</p>
    <div style="font-size:32px;font-weight:700;letter-spacing:9px;text-align:center;background:#0d9488;color:#fff;padding:18px 12px;border-radius:12px">${code}</div>
    <p style="color:#8a9a9a;font-size:12px;margin:18px 0 0;line-height:1.6">
      Valid for 10 minutes. Only use this code on the official NEXUS Campus site.<br>
      If you did not request this code, you can safely ignore this email.
    </p>
  </div>
  <p style="max-width:440px;margin:14px auto 0;color:#a5b3b3;font-size:11px;text-align:center">${schoolDomain || 'nexus.edu.sg'}</p>
</body></html>`;
  return { text, html };
}

// 发验证码。返回 { sent, reason }
async function sendLoginCode(email, code, schoolDomain) {
  const t = getTransporter();
  if (!t) return { sent: false, reason: 'SMTP not configured' };
  const cfg = getConfig();
  const { text, html } = buildCodeEmail(code, schoolDomain);
  try {
    await t.sendMail({ from: cfg.from, to: email, subject: `${code} is your NEXUS Campus login code`, text, html });
    return { sent: true };
  } catch (e) {
    console.error('[mailer] 发送失败:', e && e.message);
    return { sent: false, reason: String(e && e.message || e) };
  }
}

module.exports = { sendLoginCode, smtpConfigured };
