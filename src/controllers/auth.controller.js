import { Role } from '../models/Role.js'
import { User } from '../models/Users.js'
import { hashPassword } from '../utils/bcrypt.js'

export class AuthController {
  static async createAccount (req, res) {
    try {
      const { email, password, roles } = req.body
      const emailExist = await User.findOne({ email })
      if (emailExist) {
        const error = new Error('El usuario ya esta registrado')
        return res.status(409).json({ error: error.message, status: false })
      }
      const user = new User(req.body)
      user.password = await hashPassword(password)
      // VALIDAR ROLES
      if (roles) {
        const foundsRoles = await Role.find({ name: { $in: roles } })
        user.roles = foundsRoles.map(role => role._id)
      } else {
        const role = await Role.findOne({ name: 'USER_ROLE' })
        user.roles = [role._id]
      }
      const saveUser = await user.save()
      console.log(saveUser)
      return res.status(201).json({ message: 'Cuenta creada exitosamente', status: true, data: saveUser })
    } catch (error) {
      console.log('error', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async login (req, res) {
    try {
      const { email, password } = req.body
      const userFound = await User.findOne({ email })
      if (!userFound) {
        const error = new Error('Usuariono existe')
        return res.status(404).json({ message: error.message, status: false })
      }
      console.log(userFound)
      res.send('login')
    } catch (error) {
      console.log('error', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
