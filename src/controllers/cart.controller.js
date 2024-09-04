import { Dishes } from '../models/Dishes.js'
import { User } from '../models/Users.js'

export class CartController {
  static async addToCart (req, res) {
    try {
      const { quantity, dishId } = req.body
      // VALIDAR SI EL PLATO EXISTE
      const dish = await Dishes.findById(dishId)
      if (!dish) {
        const error = new Error('El plato no existe')
        return res.status(404).json({ message: error.message, status: false })
      }
      // VERIFICAR SI EL PLATO YA ESTA EN EL CARRITO
      const itemsIndex = req.user.cart.findIndex(item => item.dishId.toString() === dishId)
      if (itemsIndex >= 0) {
        const updateCart = [...req.user.cart]
        updateCart[itemsIndex].quantity++
        // ACTUALIZAR LA CANTIDAD DE UN PLATO ESPECIFICO SI EXISTE EN EL CARRITO DEL USUARIO
        req.user.cart = updateCart
      } else {
        // AGREGAR UN NUEVO PLATO AL CARRITO DEL USUARIO
        req.user.cart.push({ dishId, quantity })
      }
      await req.user.save()
      return res.json({ message: 'Plato agregado al carrito' })
    } catch (error) {
      return res.status(500).json({ error: error.message, status: false })
    }
  }

  static async getCart (req, res) {
    try {
      const userCart = await User.findById(req.user.id).populate('cart.dishId')
      return res.json(userCart.cart)
    } catch (error) {
      return res.status(500).json({ error: error.message, status: false })
    }
  }

  static async updateToCart (req, res) {
    try {
      // const {} = req.params
      const { quantity, dishId } = req.body
      const cart = await User.findById(req.user.id)
      if (!cart) {
        const error = new Error('carrito no encontrado')
        return res.status(404).json({ error: error.message, status: false })
      }
      const itemsIndex = req.user.cart.findIndex(item => item.dishId.toString() === dishId)
      if (itemsIndex >= 0) {
        const updateCart = [...req.user.cart]
        updateCart[itemsIndex].quantity = quantity
        req.user.cart = updateCart
        await req.user.save()
        return res.json({ message: 'Carrito actualizado' })
      } else {
        const error = new Error('Plato no encontrado en el carrito')
        return res.status(404).json({ error: error.message, status: false })
      }
    } catch (error) {
      return res.status(500).json({ error: error.message, status: false })
    }
  }

  static async removeFromCart (req, res) {
    res.send('remove from cart')
  }

  static async removeAllCart (req, res) {
    res.send('remove all cart')
  }
}
