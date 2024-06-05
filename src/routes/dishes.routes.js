import { Router } from "express";
import { DishesController } from "../controllers/dishes.controller.js";
import { validatefiles } from "../middlewares/validate-files.js";

const routes = Router();

routes.get('/', DishesController.getDishes);
routes.get('/category', DishesController.getDishesByCategoryName);
routes.post('/create', validatefiles, DishesController.addDishes);
routes.get('/:id', DishesController.getDishById);
routes.put('/update/:id', DishesController.updateDishes);
routes.delete('/delete/:id', DishesController.removeDishes);

export default routes;
