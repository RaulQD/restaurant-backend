import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const config = () => {
  return {
    host: process.env.MAILER_HOST,
    port: +process.env.MAILER_PORT,
    secure: false,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_SECRET_KEY
    }
  }
}

export const transporter = nodemailer.createTransport(config())
