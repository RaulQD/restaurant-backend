import { Address } from '../models/Address.js'

export class AddressController {
  static async createAddress (req, res) {
    try {
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

  static async getAddressById (req, res) {
    try {
      const { id } = req.params
      const address = await Address.findById(id)
      if (!address) {
        const error = new Error('Dirección no encontrada')
        return res.status(404).json({ error: error.message, status: false })
      }
      return res.json(address)
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

  static async updateAddress (req, res) {
    try {
      const { id } = req.params
      const { references } = req.body
      const address = await Address.findById(id)
      if (!address) {
        const error = new Error('Dirección no encontrada')
        return res.status(404).json({ error: error.message, status: false })
      }
      // VALIDAR QUE EL USUARIO QUE ESTA ACTUALIZANDO LA DIRECCION SEA EL MISMO QUE LA CREO
      if (address.user.toString() !== req.user.id) {
        const error = new Error('No puedes actualizar esta dirección')
        return res.status(403).json({ error: error.message, status: false })
      }
      address.references = references
      await address.save()
      return res.json({ message: 'Dirección actualizada correctamente' })
    } catch (error) {
      return res.status(500).json({ error: error.message, status: false })
    }
  }

  static async deleteAddress (req, res) {
    try {
      const { id } = req.params
      const address = await Address.findById(id)
      if (!address) {
        const error = new Error('Dirección no encontrada')
        return res.status(404).json({ error: error.message, status: false })
      }
      // VALIDAR QUE EL USUARIO QUE ESTA ELIMINANDO LA DIRECCION SEA EL MISMO QUE LA CREO
      if (address.user.toString() !== req.user.id) {
        const error = new Error('No puedes eliminar esta dirección')
        return res.status(403).json({ error: error.message, status: false })
      }
      await address.deleteOne()
      return res.json({ message: 'Dirección eliminada correctamente' })
    } catch (error) {
      return res.status(500).json({ error: error.message, status: false })
    }
  }
}
