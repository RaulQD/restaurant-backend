import { populateItemscart } from '../helpers/populateItemscart.js'
import { Cart } from '../models/Cart.js'
import { Dishes } from '../models/Dishes.js'

export class CartController {
  static async addToCart (req, res) {
    try {
      const { userId, dishId, quantity } = req.body
      // VALIDAR SI EL USUARIO EXISTE
      if (!userId) {
        const error = new Error('El usuario no existe')
        return res.status(404).json({ message: error.message, status: false })
      }
      // VALIDAR SI EL PLATO EXISTE
      const dish = await Dishes.findById(dishId)
      if (!dish) {
        const error = new Error('El plato no existe')
        return res.status(404).json({ message: error.message, status: false })
      }
      // BUSCAR EL CARRITO DEL USUARIO
      let cart = await Cart.findOne({ userId })
      // SI NO EXISTE EL CARRITO DEL USUARIO, CREAR UNO NUEVO
      if (!cart) {
        cart = new Cart({ userId, items: [] })
      }
      // VERIFICAR SI EL PLATO YA ESTA EN EL CARRITO
      const itemsIndex = cart.items.findIndex(item => item.dishId.toString() === dishId)
      // SI NO EXISTE EL PLATO EN EL CARRITO, AGREGARLO
      if (itemsIndex === -1) {
        cart.items.push({ dishId, quantity })
      } else {
        // SI EXISTE EL PLATO EN EL CARRITO, ACTUALIZAR LA CANTIDAD
        cart.items[itemsIndex].quantity += quantity
      }
      await cart.save()
      return res.json({ message: 'Plato agregado al carrito', data: cart })
    } catch (error) {
      return res.status(500).json({ error: error.message, status: false })
    }
  }

  static async getCart (req, res) {
    try {
      const { userId } = req.params
      // Buscar el carrito del usuario y hacer populate en los productos
      const cart = await Cart.findOne({ userId }).populate({ path: 'items.dishId', select: 'name originalPrice images' })
      // Verificar si el carrito existe
      if (!cart) {
        const error = new Error('El carrito no existe')
        return res.status(404).json({ message: error.message, status: false })
      }
      // Mapear los items poblados para estructurar la respuesta
      const populateItems = populateItemscart(cart.items)
      // OBTENER UNA COPIA DEL OBJETO CART
      const cartObject = cart.toObject()

      delete cartObject.__v

      return res.json({ ...cartObject, items: populateItems })
    } catch (error) {
      return res.status(500).json({ error: error.message, status: false })
    }
  }

  static async increaseQuantity (req, res) {
    try {
      const { dishId, quantity } = req.body
      // VALIDAR SI LA CANTIDAD ES MAYOR A 0
      if (quantity <= 0) {
        const error = new Error('La cantidad debe ser mayor a 0')
        return res.status(400).json({ message: error.message, status: false })
      }

      const cart = await Cart.findOne({ userId: req.user._id }).populate({ path: 'items.dishId', select: 'name originalPrice images' })
      if (!cart) {
        const error = new Error('El carrito no existe')
        return res.status(404).json({ message: error.message, status: false })
      }
      const itemsIndex = cart.items.findIndex(item => item.dishId._id.toString() === dishId)
      if (itemsIndex === -1) {
        const error = new Error('El plato no existe en el carrito')
        return res.status(404).json({ message: error.message, status: false })
      }
      cart.items[itemsIndex].quantity += quantity // AUMENTAR LA CANTIDAD EN 1
      // Mapear los items poblados para estructurar la respuesta
      const populateItems = populateItemscart(cart.items)
      await cart.save()
      // OBTENER UNA COPIA DEL OBJETO CART
      const cartObject = cart.toObject()
      delete cartObject.__v
      return res.status(200).json({ ...cartObject, items: populateItems })
    } catch (error) {
      return res.status(500).json({ error: error.message, status: false })
    }
  }

  static async decreaseQuantity (req, res) {
    try {
      const { dishId, quantity } = req.body
      // BUSCAR EL CARRITO DEL USUARIO
      const cart = await Cart.findOne({ userId: req.user._id }).populate({ path: 'items.dishId', select: 'name originalPrice images' })
      // VALIDAR SI EL CARRITO EXISTE
      if (!cart) {
        const error = new Error('El carrito no existe')
        return res.status(404).json({ message: error.message, status: false })
      }
      // BUSCAR EL PLATO EN EL CARRITO mediante el dishId
      const itemsIndex = cart.items.findIndex(item => item.dishId._id.toString() === dishId)
      if (itemsIndex === -1) {
        const error = new Error('El plato no existe en el carrito')
        return res.status(404).json({ message: error.message, status: false })
      }
      // DISMINUIR LA CANTIDAD DEL PLATO O ELIMINARLO DEL CARRITO
      let message = ''
      if (cart.items[itemsIndex].quantity > 1) {
        cart.items[itemsIndex].quantity -= quantity // DISMINUIR LA CANTIDAD EN 1]
        message = 'Se actualizó la cantidad del plato'
      } else {
        cart.items.splice(itemsIndex, 1) // ELIMINAR EL PLATO DEL CARRITO SI LA CANTIDAD ES 1
        message = 'Se eliminó el plato del carrito'
      }
      // Mapear los items poblados para estructurar la respuesta
      const populateItems = populateItemscart(cart.items)
      // GUARDAR LOS CAMBIOS
      await cart.save()
      // OBTENER UNA COPIA DEL OBJETO CART
      const cartObject = cart.toObject()
      delete cartObject.__v
      return res.status(200).json({ message, ...cartObject, items: populateItems })
    } catch (error) {
      return res.status(500).json({ error: error.message, status: false })
    }
  }

  static async removeFromCart (req, res) {
    try {
      const { dishId, userId } = req.params
      // BUSCAR EL CARRITO DEL USUARIO
      const cart = await Cart.findOne({ userId }).populate({ path: 'items.dishId', select: 'name originalPrice images' })
      if (!cart) {
        const error = new Error('El carrito no existe')
        return res.status(404).json({ message: error.message, status: false })
      }
      // ELIMINAR EL PLATO DEL CARRITO
      cart.items = cart.items.filter(item => item.dishId._id.toString() !== dishId)
      // Mapear los items poblados para estructurar la respuesta
      const populateItems = populateItemscart(cart.items)
      await cart.save()
      // OBTENER UNA COPIA DEL OBJETO CART
      const cartObject = cart.toObject()
      delete cartObject.__v
      return res.status(200).json({ message: 'Plato eliminado del carrito', ...cartObject, items: populateItems })
    } catch (error) {
      return res.status(500).json({ error: error.message, status: false })
    }
  }

  static async removeAllCart (req, res) {
    res.send('remove all cart')
  }
}
