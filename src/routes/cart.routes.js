import { Router } from 'express'
import { validateToken } from '../middlewares/auth.js'
import { CartController } from '../controllers/cart.controller.js'

const routes = Router()

routes.get('/:userId', validateToken, CartController.getCart)
routes.post('/', validateToken, CartController.addToCart)
// routes.put('/', validateToken, CartController.updateToCart)
routes.put('/increase', validateToken, CartController.increaseQuantity)
routes.put('/decrease', validateToken, CartController.decreaseQuantity)
routes.delete('/:userId/:dishId', validateToken, CartController.removeFromCart)
routes.delete('/', validateToken, CartController.removeAllCart)

export default routes
