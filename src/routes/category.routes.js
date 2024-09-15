import { Router } from 'express'
import { CategoryController } from '../controllers/category.controller.js'
import { validateCategoryExist, validateCategoryIdExist, validateFieldsCategory } from '../middlewares/category.js'
import { isAdmin, validateToken } from '../middlewares/auth.js'

const router = Router()

router.get('/', CategoryController.getAllCategories)
router.post('/', validateToken, isAdmin, validateFieldsCategory, CategoryController.createCategory)
router.get('/:id', validateCategoryIdExist, validateCategoryExist, CategoryController.getCategoryById)
router.put('/:id', validateToken, isAdmin, validateCategoryIdExist, validateCategoryExist, CategoryController.updateCategory)
router.delete('/:id', validateToken, isAdmin, CategoryController.deleteCategory)

export default router
