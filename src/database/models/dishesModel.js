import conn from '../mysql-db.js';

export class DishesModel {

    static async getAllDishes() {
        try {
            //OBTENER TODOS LOS PLATOS DE LA BASE DE DATOS 
            const [result] = await conn.query('SELECT dishes.id_dish,dishes.dishes_name,dishes.description,dishes.price,dishes.available,dishes.image_url,dishes.created_at,Category.id_category,Category.category_name FROM Dishes JOIN Category ON dishes.category_id = Category.id_category ORDER BY Dishes.id_dish ASC;');
            //SI NO SE ENCUENTRA NINGUN PLATO
            if (result.length === 0) {
                return [];
            }
            return result;
        } catch (error) {
            if (error.code === 'ER_BAD_FIELD_ERROR')
                console.error('Error al obtener los platos:', error);
            throw new Error('Error al obtener los platos');
        }
    }
    static async getDishByCategoryName({ categoryName }) {
        try {
            const lowerCaseCategoryName = categoryName.toLowerCase();
            //OBTENER LOS PLATOS POR NOMBRE DE CATEGORIA
            const [filterDishesByCategoryName] = await conn.query('SELECT dishes.id_dish,dishes.dishes_name,dishes.description,dishes.price,dishes.available,dishes.image_url,dishes.created_at,Category.id_category,Category.category_name FROM dishes JOIN Category ON dishes.category_id = Category.id_category WHERE LOWER(category.category_name) =  ?', [lowerCaseCategoryName]);
            if (filterDishesByCategoryName.length === 0) {
                return [];
            }
            return filterDishesByCategoryName;
        } catch (error) {
            console.error('Error al obtener los platos por categoria:', error);
            throw new Error('Error al obtener los platos por categoria');
        }
    }
    static async getDishById({ id }) {
        try {

            const [result] = await conn.query('SELECT dishes.id_dish, dishes.dishes_name, dishes.description, dishes.price, dishes.available, dishes.image_url, Dishes.created_at, Category.id_category, Category.category_name FROM Dishes JOIN category ON dishes.category_id = category.id_category WHERE id_dish = ? ', [id]);

            console.log('Resultado de la consulta:', result); // Registro de depuración
            return result;
        } catch (error) {
            throw new Error('Error al obtener el plato por ID');
        }
    }

    static async getDishByName({ dishes_name }) {
        try {
            const [result] = await conn.query('SELECT * FROM dishes WHERE dishes_name = ?', [dishes_name]);
            return result;
        } catch (error) {
            console.error('Error al obtener el plato por nombre:', error);
            throw new Error('Error al obtener el plato por nombre');
        }
    }
    static async create(input) {
        try {
            const { dishes_name, description, price, image_url, created_at, id_category } = input;
            //INSERTAR EL PLATO EN LA TABLA DE PLATOS
            const [result] = await conn.query('INSERT INTO dishes(dishes_name,description,price,image_url,category_id) VALUES (?,?,?,?,?)', [dishes_name, description, price, image_url, id_category]);
            const dishId = result.insertId;
            // OBTENER LA CATEGORÍA DEL PLATO CREADO
            const [category] = await conn.query('SELECT * FROM category WHERE id_category = ?', [id_category]);
            // CREAR EL OBJETO DEL NUEVO PLATO
            const newDish = {
                id: dishId,
                dishes_name,
                description,
                price,
                created_at,
                image_url,
                category: category[0] // Asegurarse de que esté accediendo al primer (y único) resultado
            };

            return newDish;
        } catch (error) {
            console.log(error);
            throw new Error('Error al crear un plato');
        }
    }

    static async update(input) {
        try {
            const { id, dishes_name, description, price, available, updated_at, id_category } = input;
            //ACTUALIZAR EL PLATO
            const [result] = await conn.query('UPDATE dishes SET dishes_name = ?, description = ?, price = ?, available = ?, updated_at = ?, category_id = ? WHERE id_dish = ?', [dishes_name, description, price, available, updated_at, id_category, id]);

            return result;
        } catch (error) {
            console.error('Error al actualizar el plato:', error);
            throw new Error('Error al actualizar el plato');
        }
    }

    static async updateImageDishes({ id, image_url }) {
        try {
            const [result] = await conn.query('UPDATE dishes SET image_url = ? WHERE id_dish = ?', [image_url, id]);
            return result;
        } catch (error) {
            console.error('Error al actualizar la imagen del plato:', error);
            throw new Error('Error al actualizar la imagen del plato');
        }
    }
    static async delete({ id }) {
        try {
            const [result] = await conn.query('DELETE FROM dishes WHERE id_dish = ?', [id]);
            //CAMBIAR EL ESTADO DEL PLATO A NO DISPONIBLE


            return result;
        } catch (error) {
            console.error('Error al eliminar el plato:', error);
            throw new Error('Error al eliminar el plato');
        }
    }
    //FILTRAR LOS PLATOS POR ID DE CATEGORIA
    static async filterByCategory({ id_category }) {
        try {

        } catch (error) {

        }
    }
}