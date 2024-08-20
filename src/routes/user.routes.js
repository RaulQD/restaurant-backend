import { Router } from 'express'
import { UserController } from '../controllers/user.controller.js'
import { validateToken } from '../middlewares/auth.js'
import { validateAddress } from '../middlewares/users.js'

const routes = Router()

routes.get('/', UserController.getUsers)
routes.get('/current-user', validateToken, UserController.getCurrentUser)
// routes.put('/update-user', validateToken, UserController.updateUser)
// routes.get('/:id', UserController.getUserByIdWithRole)
// routes.post('/', UserController.createUser)
// routes.delete('/:id)

export default routes
