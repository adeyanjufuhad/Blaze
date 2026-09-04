const nodemailer = require('nodemailer');

// Initialize transporter
let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;

  if (GMAIL_USER && GMAIL_APP_PASSWORD) {
    transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });
    console.log('[Blaze Mail] Initialized Gmail SMTP transporter');
    return transporter;
  }

  // Development fallback: ethereal or mock transporter
  console.log('[Blaze Mail] No Gmail credentials found. Using test ethereal/log transporter.');
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`[Blaze Mail] Ethereal test mailer ready (${testAccount.user})`);
    return transporter;
  } catch (err) {
    // Ultimate fallback: console logger transporter
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('\n================== [BLAZE EMAIL MOCK] ==================');
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Preview: ${mailOptions.text || 'HTML Email sent'}`);
        console.log('========================================================\n');
        return { messageId: 'mock-' + Date.now() };
      },
    };
    return transporter;
  }
};

// Base Dark-themed HTML Email Wrapper
const createDarkEmailTemplate = (title, contentHtml) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #0f0f0f;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: #ffffff;
      }
      .container {
        max-width: 580px;
        margin: 40px auto;
        background-color: #171717;
        border: 1px solid #2a2a2a;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      }
      .header {
        padding: 32px 32px 24px;
        background: linear-gradient(180deg, #1f1f1f 0%, #171717 100%);
        border-bottom: 1px solid #2a2a2a;
        text-align: center;
      }
      .brand-title {
        color: #ffffff;
        font-size: 26px;
        font-weight: 900;
        letter-spacing: -0.5px;
        margin: 8px 0 0;
      }
      .brand-sub {
        color: #ff4500;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
      }
      .body-content {
        padding: 32px;
        color: #d1d5db;
        font-size: 15px;
        line-height: 1.6;
      }
      .btn {
        display: inline-block;
        background-color: #ff4500;
        color: #ffffff !important;
        font-size: 15px;
        font-weight: 700;
        text-decoration: none;
        padding: 14px 28px;
        border-radius: 8px;
        margin: 24px 0;
        box-shadow: 0 4px 14px rgba(255, 69, 0, 0.4);
      }
      .footer {
        padding: 24px 32px;
        background-color: #121212;
        border-top: 1px solid #222222;
        text-align: center;
        font-size: 12px;
        color: #6b7280;
      }
      .table-custom {
        width: 100%;
        border-collapse: collapse;
        margin-top: 16px;
      }
      .table-custom th {
        text-align: left;
        padding: 10px;
        background-color: #222222;
        color: #9ca3af;
        font-size: 12px;
        text-transform: uppercase;
      }
      .table-custom td {
        padding: 10px;
        border-bottom: 1px solid #262626;
        color: #ffffff;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div style="display:inline-block; width:44px; height:44px; background-color:#ff4500; border-radius:10px; line-height:44px; text-align:center; font-size:22px;">🔥</div>
        <h1 class="brand-title">BLAZE</h1>
        <div class="brand-sub">PIZZA · DELIVERED</div>
      </div>
      <div class="body-content">
        ${contentHtml}
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Blaze Pizza. Built for the bold.<br>
        If you did not request this email, you can safely disregard it.
      </div>
    </div>
  </body>
  </html>
  `;
};

// 1. Send Email Verification
const sendVerificationEmail = async (email, token, name) => {
  const mailer = await getTransporter();
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const verifyUrl = `${clientUrl}/auth/verify-email/${token}`;

  const html = createDarkEmailTemplate(
    'Verify your Blaze account',
    `
    <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">Welcome to Blaze, ${name}!</h2>
    <p>You are one step away from tasting artisanal pizzas that hit different. Please confirm your email address by clicking the button below:</p>
    <div style="text-align: center;">
      <a href="${verifyUrl}" class="btn">Verify Email</a>
    </div>
    <p style="font-size: 13px; color: #9ca3af;">
      Or copy and paste this link in your browser:<br>
      <a href="${verifyUrl}" style="color: #ff4500; word-break: break-all;">${verifyUrl}</a>
    </p>
    `
  );

  const mailOptions = {
    from: `"Blaze Pizza" <${process.env.GMAIL_USER || 'noreply@blaze.com'}>`,
    to: email,
    subject: 'Verify your Blaze account',
    html,
  };

  const info = await mailer.sendMail(mailOptions);
  console.log(`[Blaze Mail] Verification email dispatched to ${email}. Preview: ${nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : 'sent'}`);
  return info;
};

// 2. Send Password Reset Email
const sendPasswordResetEmail = async (email, token, name) => {
  const mailer = await getTransporter();
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/auth/reset-password/${token}`;

  const html = createDarkEmailTemplate(
    'Reset your Blaze password',
    `
    <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">Password Reset Request</h2>
    <p>Hi ${name || 'there'}, we received a request to reset your password for your Blaze account.</p>
    <div style="text-align: center;">
      <a href="${resetUrl}" class="btn">Reset Password</a>
    </div>
    <p style="font-size: 13px; color: #ff9800; font-weight: 600;">
      ⚠️ Note: This link will expire in 1 hour for your security.
    </p>
    <p style="font-size: 13px; color: #9ca3af;">
      If you did not request this, please ignore this email. Your account remains completely secure.
    </p>
    `
  );

  const mailOptions = {
    from: `"Blaze Pizza" <${process.env.GMAIL_USER || 'noreply@blaze.com'}>`,
    to: email,
    subject: 'Reset your Blaze password',
    html,
  };

  const info = await mailer.sendMail(mailOptions);
  console.log(`[Blaze Mail] Password reset email dispatched to ${email}`);
  return info;
};

// 3. Send Low Stock Alert Email to Admin
const sendLowStockAlertEmail = async (adminEmail, lowStockItems) => {
  const mailer = await getTransporter();
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const inventoryUrl = `${clientUrl}/admin/inventory`;

  const rows = lowStockItems
    .map(
      (item) => `
      <tr>
        <td><strong>${item.name}</strong></td>
        <td>${item.type}</td>
        <td style="color: #ff4500; font-weight: bold;">${item.stock} ${item.unit}</td>
        <td>${item.threshold} ${item.unit}</td>
      </tr>
    `
    )
    .join('');

  const html = createDarkEmailTemplate(
    '⚠️ Blaze Stock Alert',
    `
    <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">⚠️ Blaze Stock Alert: Action Required</h2>
    <p>The daily stock monitor identified <strong>${lowStockItems.length}</strong> inventory items currently below their designated reorder threshold:</p>
    
    <table class="table-custom">
      <thead>
        <tr>
          <th>Item</th>
          <th>Type</th>
          <th>Current Stock</th>
          <th>Threshold</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div style="text-align: center; margin-top: 24px;">
      <a href="${inventoryUrl}" class="btn">Go to Inventory</a>
    </div>
    `
  );

  const mailOptions = {
    from: `"Blaze Alert Bot" <${process.env.GMAIL_USER || 'alerts@blaze.com'}>`,
    to: adminEmail || process.env.ADMIN_EMAIL || 'admin@blaze.com',
    subject: `⚠️ Blaze Stock Alert — ${lowStockItems.length} Items Low`,
    html,
  };

  const info = await mailer.sendMail(mailOptions);
  console.log(`[Blaze Mail] Low stock alert email dispatched to ${mailOptions.to}`);
  return info;
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendLowStockAlertEmail,
};
