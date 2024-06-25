import { Router } from "express";
import { UploadsController } from "../controllers/uploads..js";
import { validateParams } from "../middlewares/validate-params.js";
import { validatefiles } from "../middlewares/validate-files.js";



const routes = Router();

routes.post('/uploads', validatefiles, UploadsController.uploadFile);
// routes.put('/uploads/:type/:id', validatefiles, validateParams, UploadsController.updateImage);
routes.put('/uploads/:type/:id', validatefiles, validateParams, UploadsController.updateImageCloudinary);
routes.get('/uploads/:type/:id', validateParams, UploadsController.getImage);


export default routes;