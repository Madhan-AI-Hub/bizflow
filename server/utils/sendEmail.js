const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Check if credentials exist
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('==========================================');
    console.log('⚠️  EMAIL SERVICE NOT CONFIGURED  ⚠️');
    console.log('To send real emails, set EMAIL_USER and EMAIL_PASS in .env');
    console.log('------------------------------------------');
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: \n${options.message}`);
    console.log('==========================================');
    return true; // Simulate success
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const message = {
    from: `${process.env.FROM_NAME || 'BizFlow Support'} <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
