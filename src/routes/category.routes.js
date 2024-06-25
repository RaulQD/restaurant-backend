import { Router } from "express";
import { CategoryController } from "../controllers/category.js";



const router = Router();

router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);
router.post('/create', CategoryController.createCategory);
router.put('/update', CategoryController.updateCategory);



export default router;
