import { Router } from 'express'
import { AddressController } from '../controllers/address.controller.js'
import { validateToken } from '../middlewares/auth.js'
import { validateAddress } from '../middlewares/users.js'

const routes = Router()

routes.get('/', validateToken, AddressController.getUserAddress)
routes.post('/', validateToken, validateAddress, AddressController.createAddress)

export default routes
