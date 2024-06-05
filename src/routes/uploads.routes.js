import { Router } from "express";
import { UploadsController } from "../controllers/uploads.controller.js";
import { validateParams } from "../middlewares/validate-params.js";
import { validatefiles } from "../middlewares/validate-files.js";



const routes = Router();

routes.post('/uploads', UploadsController.uploadFile);
routes.put('/uploads/:type/:id', validatefiles, validateParams, UploadsController.updateImage)

export default routes;