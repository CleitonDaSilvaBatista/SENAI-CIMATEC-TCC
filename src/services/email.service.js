const nodemailer = require('nodemailer')

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    const err = new Error('Serviço de e-mail não configurado.')
    err.statusCode = 500
    throw err
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

async function sendResetPasswordEmail(email, token) {
  const transporter = getTransporter()

  const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Redefinição de senha - Jobee',
    html: `
      <h2>Redefinição de Senha</h2>
      <p>Você solicitou a redefinição de senha da sua conta.</p>
      <p><a href="${resetLink}">Clique aqui para redefinir sua senha</a></p>
      <p>Este link expira em 30 minutos.</p>
      <p>Se não solicitou esta redefinição, ignore este e-mail.</p>
    `
  })
}

module.exports = {
  sendResetPasswordEmail
}