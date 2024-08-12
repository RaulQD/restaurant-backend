import { Router } from 'express'

import { DishesController } from '../controllers/dishes.controller.js'
import { validateDishes, validateDishesIdExist } from '../middlewares/dishes.js'
import { isAdmin, validateToken } from '../middlewares/auth.js'

const routes = Router()

routes.get('/', DishesController.getDishes)
routes.post('/', validateToken, isAdmin, validateDishes, DishesController.createDishes)
routes.get('/:id', validateDishesIdExist, DishesController.getDishById)
routes.put('/:id', validateToken, isAdmin, validateDishesIdExist, DishesController.updateDishes)
routes.delete('/:id', validateToken, isAdmin, validateDishesIdExist, DishesController.removeDishes)
routes.patch('/:id/status', validateToken, isAdmin, validateDishesIdExist, DishesController.updatedDishesStatus)
// routes.patch('/:id', DishesController.updateDishesAvailable);
// routes.get('/', DishesController.getDishes);
// routes.get('/findByDishName', DishesController.searchDishesByName)
// routes.get('/available', DishesController.getDishesAvailable)
// routes.get('/findDishesByCategoryName', DishesController.getDishesByCategoryName);

export default routes
