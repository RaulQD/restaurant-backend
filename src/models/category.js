import pool from '../config/mysql-db.js';



export class CategoryModel {

    static async getAllCategories() {
        try {
            const [categories] = await pool.query('SELECT * FROM categorydishes');
            return categories;
        } catch (error) {
            console.error('Error al obtener las categorias:', error);
            throw new Error('Error al obtener las categorias');
        }
    }
    static async getCategoryById({ id }) {
        try {
            const [category] = await pool.query('SELECT * FROM categoryDishes WHERE id_category = ?', [id]);
            if (!category || category.length === 0) {
                return [];
            }
            const categoryDish = {
                id: category[0].id_category,
                categoryName: category[0].categoryName,
                enable: category[0].enable
            }
            return categoryDish;
        } catch (error) {
            console.error('Error al obtener la categoria por id:', error);
            throw new Error('Error al obtener la categoria por id');
        }
    }
    static async getCategoryByName({ categoryName }) {
        try {
            const [category] = await pool.query('SELECT * FROM categoryDishes WHERE categoryName = ?', [categoryName]);
            return category;
        } catch (error) {
            console.error('Error al obtener la categoria por nombre:', error);
            throw new Error('Error al obtener la categoria por nombre');
        }
    }
    static async createCategory(input) {
        const { categoryName, enable } = input;
        try {
            const enableValue = enable ?? 'Active';
            const [category] = await pool.query('INSERT INTO categoryDishes(categoryName, enable) VALUES ( ?,? )', [categoryName, enableValue])
            return { id: category.insertId, categoryName, enable: enableValue }
        } catch (error) {
            console.error('Error al crear una categoria:', error);
            throw new Error('Error al crear una categoria');
        }
    }
    static async updateCategory(input) {
        try {
            const { id, categoryName, enable } = input;
            console.log(input);

        } catch (error) {
            console.error('Error al actualizar una categoria:', error);
            throw new Error('Error al actualizar una categoria');
        }
    }
}