import { Router } from 'express'

import { validateDishes } from '../middlewares/validate-fields-dishes.js'
import { DishesController } from '../controllers/Dishes.controller.js'

const routes = Router()

routes.get('/', DishesController.getDishes)
routes.post('/', validateDishes, DishesController.createDishes)
routes.get('/:id', DishesController.getDishById)
routes.put('/:id', validateDishes, DishesController.updateDishes)
routes.delete('/:id', DishesController.removeDishes)
// routes.patch('/:id', DishesController.updateDishesAvailable);
// routes.get('/', DishesController.getDishes);
// routes.get('/findByDishName', DishesController.searchDishesByName)
// routes.get('/available', DishesController.getDishesAvailable)
// routes.get('/findDishesByCategoryName', DishesController.getDishesByCategoryName);

export default routes
