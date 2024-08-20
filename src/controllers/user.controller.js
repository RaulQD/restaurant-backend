import { Address } from '../models/Address.js'
import { User } from '../models/Users.js'

export class UserController {
  static async getCurrentUser (req, res) {
    // OBTENER EL USUARIO CON SU RESPECTIVO ROL
    const user = await User.findById(req.user.id).populate('roles')
    return res.json(user)
  }

  static async getUsers (req, res) {
    try {
      const users = await User.find().populate('roles')
      return res.json({ result: users })
    } catch (error) {
      return res.status(500).json({ error: error.message, status: false })
    }
  }

  static async getUserById (req, res) {
    res.send('getClient')
  }

  static async updateUser (req, res) {
    res.send('updateClient')
  }

  static async deleteClient (req, res) {
    res.send('deleteClient')
  }
}
