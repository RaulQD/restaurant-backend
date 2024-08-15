import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller.js'
import { validateInputs, validatePassword } from '../middlewares/users.js'
import { validateToken } from '../middlewares/auth.js'

const routes = Router()

routes.post('/login', AuthController.login)
routes.post('/register', validateInputs, AuthController.createAccount)
routes.post('/forgot-password', AuthController.resetPassword)
routes.post('/update-password/:token', validatePassword, AuthController.changePassword)
routes.post('/validate-token', AuthController.validateToken)

export default routes
