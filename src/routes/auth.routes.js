import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";



const routes = Router();

routes.post('/register/client', AuthController.createAccountClient)
routes.post('/register/employee', AuthController.createAccountEmployee)

export default routes;