import { transporter } from '../config/nodemailer.js'

export class AuthEmail {
  static async sendPasswordReset (user) {
    const info = await transporter.sendMail({
      from: 'FoodieHub <admin@foodiehub.com>',
      to: user.email,
      subject: 'Foodie Hub - Restablecer contraseña',
      text: 'Foodie Hub - Restablecer contraseña',
      html: `
          <p>Hola: ${user.name} has solicitado reestablecer tu contraseña</p>
          <p>Para restablecer tu contraseña, haz click en el siguiente enlace:</p>
          <a href="${process.env.FRONTEND_URL}/auth/update-password/${user.token}">Restablecer contraseña</a>
        `
    })
    console.log('Mensaje enviado: %s', info.messageId)
  }
}
