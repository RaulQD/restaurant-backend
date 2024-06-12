import { Router } from 'express';
import { UserController } from '../controllers/userController.js';

const routes = Router();

routes.get('/employees', UserController.getAllEmployees)
routes.get('/:id', UserController.getUserByIdWithRole)


export default routes;