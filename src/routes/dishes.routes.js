import { Router } from 'express'

import { DishesController } from '../controllers/dishes.controller.js'
import { validateDishes, validateDishesIdExist } from '../middlewares/dishes.js'
import { isAdmin, isAuthenticated } from '../middlewares/auth.js'

const routes = Router()

routes.get('/', DishesController.getDishes)
routes.post('/', isAuthenticated, isAdmin, validateDishes, DishesController.createDishes)
routes.get('/:id', validateDishesIdExist, DishesController.getDishById)
routes.put('/:id', isAuthenticated, isAdmin, validateDishesIdExist, DishesController.updateDishes)
routes.delete('/:id', isAuthenticated, isAdmin, validateDishesIdExist, DishesController.removeDishes)
routes.patch('/:id/status', isAuthenticated, isAdmin, validateDishesIdExist, DishesController.updatedDishesStatus)
// routes.patch('/:id', DishesController.updateDishesAvailable);
// routes.get('/', DishesController.getDishes);
// routes.get('/findByDishName', DishesController.searchDishesByName)
// routes.get('/available', DishesController.getDishesAvailable)
// routes.get('/findDishesByCategoryName', DishesController.getDishesByCategoryName);

export default routes
