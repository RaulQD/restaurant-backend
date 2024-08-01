import { Router } from 'express'

import { DishesController } from '../controllers/dishes.controller.js'
import { validateDishes, validateDishesIdExist } from '../middlewares/dishes.js'
import { validatefiles } from '../middlewares/validate-files.js'

const routes = Router()

routes.get('/', DishesController.getDishes)
routes.post('/', validateDishes, DishesController.createDishes)
routes.get('/:id', validateDishesIdExist, DishesController.getDishById)
routes.put('/:id', validateDishesIdExist, validateDishes, validatefiles, DishesController.updateDishes)
routes.delete('/:id', validateDishesIdExist, DishesController.removeDishes)
routes.patch('/:id/status', validateDishesIdExist, DishesController.updatedDishesStatus)
// routes.patch('/:id', DishesController.updateDishesAvailable);
// routes.get('/', DishesController.getDishes);
// routes.get('/findByDishName', DishesController.searchDishesByName)
// routes.get('/available', DishesController.getDishesAvailable)
// routes.get('/findDishesByCategoryName', DishesController.getDishesByCategoryName);

export default routes
