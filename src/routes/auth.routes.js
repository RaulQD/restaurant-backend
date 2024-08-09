import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller.js'
import { validateInputs } from '../middlewares/users.js'

const routes = Router()

routes.post('/login', AuthController.login)
routes.post('/signup', validateInputs, AuthController.createAccount)
// routes.post('/register/employee', validateFields, AuthController.createAccountEmployee)

export default routes
