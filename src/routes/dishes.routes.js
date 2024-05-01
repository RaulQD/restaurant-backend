import { Router } from "express";
import { DishesController } from "../controllers/dishes.controller.js";

const routes = Router();

routes.get('/', DishesController.getDishes);
routes.get('/:id', DishesController.getDishById);
routes.post('/create', DishesController.create);
routes.put('/update/:id', DishesController.update);
routes.delete('/delete/:id', DishesController.delete);
export default routes;
