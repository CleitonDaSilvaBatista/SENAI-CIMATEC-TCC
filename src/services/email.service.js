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
  from: `"Jobee" <${process.env.SMTP_USER}>`,
  to: email,
  subject: 'Redefinição de senha - Jobee',
  html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
  </head>
  <body style="
    margin:0;
    padding:0;
    background:#f4f7f6;
    font-family:Arial, Helvetica, sans-serif;
  ">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 20px;">

          <table width="600" cellpadding="0" cellspacing="0" style="
            background:#ffffff;
            border-radius:16px;
            overflow:hidden;
            box-shadow:0 4px 20px rgba(0,0,0,0.08);
          ">

            <!-- Header -->
            <tr>
              <td style="
                background:linear-gradient(135deg,#308668,#01cc6d);
                padding:30px;
                text-align:center;
              ">
                <h1 style="
                  color:#ffffff;
                  margin:0;
                  font-size:28px;
                ">
                  🐝 Jobee
                </h1>
                <p style="
                  color:#eafcf4;
                  margin-top:10px;
                  font-size:14px;
                ">
                  Plataforma de serviços e oportunidades
                </p>
              </td>
            </tr>

            <!-- Conteúdo -->
            <tr>
              <td style="padding:40px;">

                <h2 style="
                  margin-top:0;
                  color:#1f2937;
                ">
                  Redefinição de senha
                </h2>

                <p style="
                  color:#4b5563;
                  line-height:1.7;
                  font-size:15px;
                ">
                  Recebemos uma solicitação para redefinir a senha da sua conta Jobee.
                </p>

                <p style="
                  color:#4b5563;
                  line-height:1.7;
                  font-size:15px;
                ">
                  Para criar uma nova senha, clique no botão abaixo:
                </p>

                <div style="text-align:center;margin:35px 0;">
                  <a
                    href="${resetLink}"
                    style="
                      display:inline-block;
                      background:#308668;
                      color:#ffffff;
                      text-decoration:none;
                      padding:15px 30px;
                      border-radius:999px;
                      font-weight:bold;
                      font-size:15px;
                    "
                  >
                    Redefinir minha senha
                  </a>
                </div>

                <p style="
                  color:#6b7280;
                  font-size:14px;
                  line-height:1.7;
                ">
                  Este link é válido por <strong>30 minutos</strong>.
                </p>

                <p style="
                  color:#6b7280;
                  font-size:14px;
                  line-height:1.7;
                ">
                  Caso o botão não funcione, copie e cole o link abaixo no seu navegador:
                </p>

                <p style="
                  background:#f3f4f6;
                  padding:12px;
                  border-radius:8px;
                  word-break:break-all;
                  font-size:13px;
                  color:#374151;
                ">
                  ${resetLink}
                </p>

                <hr style="
                  border:none;
                  border-top:1px solid #e5e7eb;
                  margin:30px 0;
                ">

                <p style="
                  color:#ef4444;
                  font-size:14px;
                  line-height:1.7;
                ">
                  🔒 Se você não solicitou esta alteração, ignore este e-mail.
                  Sua senha atual permanecerá inalterada.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="
                background:#f9fafb;
                padding:20px;
                text-align:center;
              ">
                <p style="
                  margin:0;
                  color:#6b7280;
                  font-size:12px;
                ">
                  © 2025 Jobee - Todos os direitos reservados
                </p>

                <p style="
                  margin-top:8px;
                  color:#9ca3af;
                  font-size:12px;
                ">
                  Este é um e-mail automático. Não responda esta mensagem.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
  </html>
  `
})
}

module.exports = {
  sendResetPasswordEmail
}