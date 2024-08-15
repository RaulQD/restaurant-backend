import { AuthEmail } from '../emails/Emails.js'
import { generateJWT } from '../utils/jwt.js'
import { Role } from '../models/Role.js'
import { Token } from '../models/Token.js'
import { User } from '../models/Users.js'
import { checkCompare, hashPassword } from '../utils/bcrypt.js'
import { generateTokenPasswordReset } from '../utils/token.js'
import jwt from 'jsonwebtoken'

export class AuthController {
  static async createAccount (req, res) {
    try {
      const { email, password, roles, confirmPassword } = req.body
      const emailExist = await User.findOne({ email })
      if (emailExist) {
        const error = new Error('El correo ya se encuentra registrado')
        return res.status(409).json({ error: error.message, status: false })
      }
      const user = new User(req.body)
      user.password = await hashPassword(password)

      if (roles) {
        const foundsRoles = await Role.find({ name: { $in: roles } })
        user.roles = foundsRoles.map(role => role._id)
      } else {
        const role = await Role.findOne({ name: 'USER_ROLE' })
        user.roles = [role._id]
      }
      const saveUser = await user.save()
      console.log('SAVEUSER', saveUser)
      return res.status(201).json({ message: 'Cuenta creada exitosamente', status: true, data: saveUser })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async login (req, res) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) {
        const error = new Error('El usuario o contraseña son incorrectos')
        return res.status(404).json({ error: error.message, status: false })
      }
      const isPasswordMatch = await checkCompare(password, user.password)
      if (!isPasswordMatch) {
        const error = new Error('El usuario o contraseña son incorrectos')
        return res.status(400).json({ error: error.message, status: false })
      }
      const token = generateJWT({ id: user._id })
      // OBTENER EL NOMBRE DEL ROL, PARA MOSTRARLO EN EL FRONTEND Y PROTEGER LAS RUTAS DEPENDIENDO DEL ROL
      const roles = await Role.find({ _id: { $in: user.roles } })
      const data = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        rol: roles,
        token
      }
      return res.status(200).json(data)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  static async resetPassword (req, res) {
    try {
      const { email } = req.body
      const user = await User.findOne({ email })
      if (!user) {
        const error = new Error('No se ha podido enviar las instrucciones, verifique el correo')
        return res.status(404).json({ error: error.message, status: false })
      }
      if (!email || email.trim() === '') {
        const error = new Error('El correo es requerido')
        return res.status(400).json({ error: error.message, status: false })
      }
      const token = new Token({
        token: generateTokenPasswordReset({ id: user._id }),
        user: user._id
      })
      await token.save()
      AuthEmail.sendPasswordReset({
        email: user.email,
        name: user.firstName,
        token: token.token
      })
      return res.status(200).json({ message: 'Se ha enviado un correo para restablecer la contraseña.', status: true })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  static async changePassword (req, res) {
    try {
      const { token } = req.params
      const { password } = req.body
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      const tokenExist = await Token.findOne({ token })
      if (!tokenExist) {
        const error = new Error('Token no valido')
        return res.status(400).json({ error: error.message, status: false })
      }
      const user = await User.findById(decoded.id)
      user.password = await hashPassword(password)
      await Promise.allSettled([user.save(), tokenExist.deleteOne()])
      return res.status(200).json({ message: 'Contraseña actualizada correctamente', status: true })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  static async validateToken (req, res) {
    try {
      const { token } = req.body
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      const tokenExist = await Token.findOne({ token })
      if (!tokenExist) {
        const error = new Error('Token no valido')
        return res.status(400).json({ error: error.message, status: false })
      }
      const user = await User.findById(decoded.id)
      if (!user) {
        const error = new Error('Usuario no encontrado')
        return res.status(404).json({ error: error.message, status: false })
      }
      return res.status(200).json({ message: 'Token valido', status: true })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }
}
