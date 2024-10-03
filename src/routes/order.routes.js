import { Router } from 'express'
import { OrderController } from '../controllers/order.controller.js'
import { validateToken } from '../middlewares/auth.js'

const routes = Router()

routes.post('/mercado-pago', validateToken, OrderController.createOrder)

export default routes
