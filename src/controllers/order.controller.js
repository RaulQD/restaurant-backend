import { populateItemscart } from '../helpers/populateItemscart.js'
import { Address } from '../models/Address.js'
import { Cart } from '../models/Cart.js'
import { Orders } from '../models/Orders.js'
import { User } from '../models/Users.js'
import { IdentificationType, MercadoPagoConfig, Payment, Preference } from 'mercadopago'

export class OrderController {
  static async createOrder (req, res) {
    const userId = req.user.id
    const { addressId } = req.body

    console.log(' User ID : ', userId) // Verificar si se obtiene el ID de usuario
    console.log(' Address ID : ', addressId)// Verificar si se obtiene el ID de la dirección

    const cart = await Cart.findOne({ userId }).populate('items.dishId')
    if (!cart || cart.items.length === 0) {
      const error = new Error('El carrito esta vacio')
      return res.status(400).json({ error: error.message })
    }
    // Obtener la dirección completa
    const address = await Address.findOne({ _id: addressId, user: userId })
    if (!address) {
      console.log('Dirección no encontrada o no pertenece al usuario') // Log de error para depurar
      return res.status(400).json({ message: 'Dirección no encontrada o no pertenece al usuario' })
    }
    // Calcular el total de la orden
    const totalAmount = cart.items.reduce((acc, item) => acc + (item.dishId.originalPrice * item.quantity), 0)

    console.log('Total amount:', Number(totalAmount))
    console.log('Items order:', cart.items)
    const order = new Orders({
      userId,
      items: populateItemscart(cart.items),
      totalAmount: Number(totalAmount.toFixed(2)),
      deliveryAddress: {
        street: address.street,
        number: address.number,
        provinces: address.provinces,
        department: address.department,
        district: address.district
      }
    })
    console.log(populateItemscart(cart.items))
    console.log('New order:', order)
    // Guardar la orden en la base de datos
    await order.save()
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN
    })
    const preference = new Preference(client)

    // CREAR LA PREFERENCIA DE MERCADO PAGO
    const body = {
      items: cart.items.map((item) => ({
        id: item.dishId._id.toString(),
        title: item.dishId.name,
        quantity: Number(item.quantity),
        currency_id: 'PEN',
        unit_price: Number(item.dishId.originalPrice)
      })),
      payer: {
        phone: {
          area_code: '51',
          number: req.user.phone
        },
        email: req.user.email,
        name: req.user.firstName,
        surname: req.user.lastName,
        identification: {
          number: req.user.dni
        }
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL}/order/success`,
        failure: `${process.env.FRONTEND_URL}/order/failure`
      },
      auto_return: 'approved',
      external_reference: order._id.toString()
    }
    try {
      const response = await preference.create({ body })
      const init_point = response.init_point
      console.log('Mercado pago response:', response)
      return res.status(201).json({ message: 'Orden creada con exito', init_point })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
