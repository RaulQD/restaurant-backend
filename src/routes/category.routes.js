import { Router } from 'express'
import { CategoryController } from '../controllers/category.controller.js'
import { validateCategoryExist, validateCategoryIdExist, validateFieldsCategory } from '../middlewares/category.js'

const router = Router()

router.get('/', CategoryController.getAllCategories)
router.post('/', validateFieldsCategory, CategoryController.createCategory)
router.get('/:id', validateCategoryIdExist, validateCategoryExist, CategoryController.getCategoryById)
router.put('/:id', validateCategoryIdExist, validateCategoryExist, CategoryController.updateCategory)
router.delete('/:id', CategoryController.deleteCategory)

export default router
