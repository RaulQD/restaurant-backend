import { transporter } from '../config/nodemailer.js'

export class AuthEmail {
  static async sendPasswordReset (user) {
    const info = await transporter.sendMail({
      from: 'FoodieHub <admin@foodiehub.com>',
      to: user.email,
      subject: 'Foodie Hub - Restablecer contraseña',
      text: 'Foodie Hub - Restablecer contraseña',
      html: `
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4; color: #333;">
        <div style="max-width: 600px; margin: auto; background-color: white; padding: 40px; border-radius: 8px;">
          <h1 style="font-size: 32px;">¡Estás a un clic de cambiar tu contraseña!</h1>
         <div style="background-color: #ff6600; padding: 20px ">
          <h1 style="color: white;">Hola ${user.name},</h1>
          <p style="font-size: 16px; color: white;"> Has solicitado un cambio de contraseña para tu cuenta, accede al siguiente enlace para poder cambiar tu contraseña.</p>
          <p style="font-size: 16px; color: white; margin-top: 10px;">Si no solicitaste este cambio, puedes obviar este mensaje.</p>
         </div>
          
          <a href="${process.env.FRONTEND_URL}/auth/update-password/${user.token}" 
             style="display: inline-block; background-color: #ffe6d5; color: white; padding: 12px 20px; font-size: 16px; border-radius: 4px; text-decoration: none; margin-top: 20px;">
             Restablecer contraseña
          </a>

        </div>
        <p style="font-size: 12px; color: #999; margin-top: 20px;">© 2024 FoodieHub. Todos los derechos reservados.</p>
      </div>
        `
    })
    console.log('Mensaje enviado: %s', info.messageId)
  }
}
