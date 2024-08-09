import { Router } from 'express'
import { UploadController } from '../controllers/upload.controller.js'
import { validatefiles } from '../middlewares/files.js'
import { validateDishesIdExist } from '../middlewares/dishes.js'

const routes = Router()

routes.put('/dishes/:id', validateDishesIdExist, validatefiles, UploadController.uploadImageDishes)

export default routes
