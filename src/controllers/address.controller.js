import { Address } from '../models/Address.js'

export class AddressController {
  static async createAddress (req, res) {
    try {
      const { street, number, city, department, district } = req.body
      // 1 - OBTENER EL USUARIO ACTUAL CON EL TOKEN DE AUTENTICACION -listo middleware
      // 2 - VALIDAR QUE LOS CAMPOS NO ESTEN VACIOS - listo middleware      // 3 - CREAR LA DIRECCION DEL USUARIO
      const newAddress = new Address(req.body)
      newAddress.user = req.user.id
      req.user.address.push(newAddress.id)

      await Promise.allSettled([newAddress.save(), req.user.save()])
      return res.status(201).json({ message: 'Dirección creada correctamente' })
    } catch (error) {
      return res.status(500).json({ error: error.message, status: false })
    }
  }

  static async getUserAddress (req, res) {
    try {
      const address = await Address.find({ user: req.user.id })
      return res.json(address)
    } catch (error) {
      return res.status(500).json({ rror: error.message, status: false })
    }
  }
}
