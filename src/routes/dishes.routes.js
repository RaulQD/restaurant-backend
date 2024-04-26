import { Router } from "express";
import { DishesController } from "../controllers/dishes.controller.js";

const routes = Router();

routes.get('/', DishesController.getDishes);
routes.get('/:id', DishesController.getDishById);
routes.post('/createDish', DishesController.createDish);
export default routes;
