import { Router } from 'express'

import { DishesController } from '../controllers/dishes.controller.js'
import { dishesExist, validateDishes, validateDishesIdExist } from '../middlewares/dishes.js'
import { isAdmin, validateToken } from '../middlewares/auth.js'

const routes = Router()

routes.get('/', DishesController.getDishes)
routes.get('/findDishesByCategory', DishesController.getDishesByCategoryName)
routes.post('/', validateToken, isAdmin, validateDishes, DishesController.createDishes)
routes.get('/:id', validateDishesIdExist, dishesExist, DishesController.getDishById)
routes.put('/:id', validateToken, isAdmin, validateDishesIdExist, dishesExist, validateDishes, DishesController.updateDishes)
routes.delete('/:id', validateToken, isAdmin, validateDishesIdExist, dishesExist, DishesController.removeDishes)
routes.patch('/:id/status', validateToken, isAdmin, validateDishesIdExist, dishesExist, DishesController.updatedDishesStatus)

export default routes
