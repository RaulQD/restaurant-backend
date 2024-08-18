import { Router } from 'express'
import { UserController } from '../controllers/user.controller.js'
import { validateToken } from '../middlewares/auth.js'

const routes = Router()

routes.get('/current-user', validateToken, UserController.getCurrentUser)
routes.put('/update-user', validateToken, UserController.updateUser)
// routes.get('/employees', UserController.getAllEmployees)
// routes.get('/:id', UserController.getUserByIdWithRole)
// routes.post('/', UserController.createUser)
// routes.put('/:id)
// routes.delete('/:id)

export default routes
