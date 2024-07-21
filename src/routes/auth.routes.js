import { Router } from 'express'
import { validateFieldsClient } from '../middlewares/validate-campos-client.js'
import { validateFields } from '../middlewares/validate-campos-employee.js'

const routes = Router()

// routes.post('/login', AuthController.login)
// routes.post('/register/client', validateFieldsClient, AuthController.createAccountClient)
// routes.post('/register/employee', validateFields, AuthController.createAccountEmployee)

export default routes
