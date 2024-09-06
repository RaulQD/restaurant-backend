import { Cart } from '../models/Cart.js'
import { Dishes } from '../models/Dishes.js'
import { User } from '../models/Users.js'

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
    // try {
    //   const { quantity, dishId } = req.body
    //   // VALIDAR SI EL PLATO EXISTE
    //   const dish = await Dishes.findById(dishId)
    //   if (!dish) {
    //     const error = new Error('El plato no existe')
    //     return res.status(404).json({ message: error.message, status: false })
    //   }
    //   // VERIFICAR SI EL PLATO YA ESTA EN EL CARRITO
    //   const itemsIndex = req.user.cart.findIndex(item => item.dishId.toString() === dishId)
    //   if (itemsIndex >= 0) {
    //     const updateCart = [...req.user.cart]
    //     updateCart[itemsIndex].quantity++
    //     // ACTUALIZAR LA CANTIDAD DE UN PLATO ESPECIFICO SI EXISTE EN EL CARRITO DEL USUARIO
    //     req.user.cart = updateCart
    //   } else {
    //     // AGREGAR UN NUEVO PLATO AL CARRITO DEL USUARIO
    //     req.user.cart.push({ dishId, quantity })
    //   }
    //   await req.user.save()
    //   return res.json({ message: 'Plato agregado al carrito' })
    // } catch (error) {
    //   return res.status(500).json({ error: error.message, status: false })
    // }
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
      const populateCartItems = cart.items.map((item) => ({
        dishId: item.dishId._id,
        image: item.dishId.images,
        title: item.dishId.name,
        price: item.dishId.originalPrice,
        quantity: item.quantity
      }))
      // OBTENER UNA COPIA DEL OBJETO CART
      const cartObject = cart.toObject()

      delete cartObject.__v

      return res.json({ ...cartObject, items: populateCartItems })
    } catch (error) {
      return res.status(500).json({ error: error.message, status: false })
    }
  }

  static async updateToCart (req, res) {
    try {
      const { quantity, dishId } = req.body
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
