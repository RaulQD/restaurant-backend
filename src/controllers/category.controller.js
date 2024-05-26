import { CategoryModel } from "../database/models/categoryModel.js";


export class CategoryController {

    static async getAllCategories(req, res) {

        try {
            const categories = await CategoryModel.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            console.error('Error al obtener las categorias:', error);
            throw new Error('Error al obtener las categorias');
        }
    }
    static async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
                return res.status(400).json({ message: 'Id must be a positive integer' });
            }
            const category = await CategoryModel.getCategoryById({ id });
            if (category.length === 0) {
                return res.status(404).json({ message: `Category with id ${id} not found`, status: 404 });
            }
            if (category) return res.status(200).json({ message: 'Category found', status: 200, category });

        } catch (error) {
            console.error('Error al obtener la categoria por id:', error);
            throw new Error('Error al obtener la categoria por id');
        }
    }
    static async createCategory(req, res) {
        try {
            const { categoryName, enable } = req.body;

            // Check if the category already exists
            const categoryExist = await CategoryModel.getCategoryByName({ categoryName });
            if (categoryExist.length) {
                console.log({ categoryExist }, 'Category already exists')
                return res.status(400).json({ message: 'Category already exists', status: 400 });
            }
            // Create the category
            const category = await CategoryModel.createCategory({ categoryName, enable });
            return res.status(201).json({ message: 'Category created successfully', status: 201, category });

        } catch (error) {
            console.error('Error al crear una categoria:', error);
            throw new Error('Error al crear una categoria');
        }
    }
    static async updateCategory(req, res) {
        console.log('updateCategory')
    }
}