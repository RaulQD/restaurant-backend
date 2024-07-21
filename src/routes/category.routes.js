import { Router } from 'express'
import { CategoryController } from '../controllers/category.controller.js'
import { validateCategoryExist } from '../middlewares/category.js'

const router = Router()

router.get('/', CategoryController.getAllCategories)
router.post('/', CategoryController.createCategory)
router.get('/:id', validateCategoryExist, CategoryController.getCategoryById)
router.put('/:id', CategoryController.updateCategory)

export default router
