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
      const users = await User.find().populate('roles').populate('address')
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

  static async createAddress (req, res) {
    try {
      const { street, number, city, department, district } = req.body
      // 1 - OBTENER EL USUARIO ACTUAL CON EL TOKEN DE AUTENTICACION
      // 2 - VALIDAR QUE LOS CAMPOS NO ESTEN VACIOS - listo
      // 3 - CREAR LA DIRECCION DEL USUARIO
      const newAddress = new Address(req.body)
      newAddress.user = req.user.id
      req.user.address.push(newAddress.id)
      await newAddress.save()
      await req.user.save()
      // req.user.address.push = newAddress
      // const userAddress = await req.user.save()
      console.log(newAddress)
      return res.status(201).json({ message: 'Dirección creada correctamente' })
    } catch (error) {
      return res.status(500).json({ error: error.message, status: false })
    }
  }
}
