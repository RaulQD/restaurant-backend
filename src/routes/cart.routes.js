import { Router } from 'express'
import { validateToken } from '../middlewares/auth.js'
import { CartController } from '../controllers/cart.controller.js'

const routes = Router()

routes.get('/', validateToken, CartController.getCart)
routes.post('/', validateToken, CartController.addToCart)
routes.put('/', validateToken, CartController.updateToCart)
routes.delete('/', validateToken, CartController.removeAllCart)
routes.delete('/:id', validateToken, CartController.removeFromCart)

export default routes
