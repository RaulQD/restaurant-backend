import pool from '../config/mysql-db.js';

export class DishesModel {

    //PARA EL USUARIO ADMINISTRADOR
    static async getAllDishes() {
        let connection;
        try {
            connection = await pool.getConnection();
            //OBTENER TODOS LOS PLATOS DE LA BASE DE DATOS 
            const [result] = await connection.query('SELECT dishes.id_dish,dishes.dishes_name,dishes.description,dishes.price,dishes.available,dishes.image_url,dishes.created_at,Category.id_category,Category.category_name FROM Dishes JOIN Category ON dishes.category_id = Category.id_category ORDER BY Dishes.id_dish ASC;');
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
    //PARA EL USUARIO CLIENTE
    static async getAllDishesAvailable() {
        try {
            //OBTENER TODOS LOS PLATOS DISPONIBLES DE LA BASE DE DATOS 
            const [result] = await pool.query('SELECT dishes.id_dish,dishes.dishes_name,dishes.description,dishes.price,dishes.available,dishes.image_url,dishes.created_at,Category.id_category,Category.category_name FROM Dishes JOIN Category ON dishes.category_id = Category.id_category WHERE dishes.available = 1 ORDER BY Dishes.id_dish ASC;');
            //SI NO SE ENCUENTRA NINGUN PLATO
            if (result.length === 0) {
                return [];
            }
            return result;
        } catch (error) {

            console.error('Error al obtener los platos:', error);
            throw new Error('Error al obtener los platos');
        }
    }
    //PARA EL USUARIO CLIENTE
    static async getDishByCategoryName({ category }) {
        try {
            const lowerCaseCategoryName = category.toLowerCase();
            //OBTENER LOS PLATOS POR NOMBRE DE CATEGORIA
            const [result] = await pool.query('SELECT dishes.id_dish,dishes.dishes_name,dishes.description,dishes.price,dishes.available,dishes.image_url,dishes.created_at,category.id_category,category.category_name FROM dishes JOIN category ON dishes.category_id = category.id_category WHERE LOWER(category.category_name) = ? AND dishes.available = 1', [lowerCaseCategoryName]);
            if (result.length === 0) {
                return [];
            }
            return result;
        } catch (error) {
            console.error('Error al obtener los platos por categoria:', error);
            throw new Error('Error al obtener los platos por categoria');
        }
    }
    //PARA EL USUARIO ADMINISTRADOR Y CLIENTE
    static async getDishById({ id }) {
        try {
            const [result] = await pool.query('SELECT dishes.id_dish, dishes.dishes_name, dishes.description, dishes.price, dishes.available, dishes.image_url, Dishes.created_at, Category.id_category, Category.category_name FROM Dishes JOIN category ON dishes.category_id = category.id_category WHERE id_dish = ? ', [id]);

            console.log('Resultado de la consulta:', result); // Registro de depuración
            return result;
        } catch (error) {
            throw new Error('Error al obtener el plato por ID');
        }
    }
    //FILTRAR LOS PLATOS POR NOMBRE DE CATEGORIA
    //PARA EL USUARIO CLIENTE Y ADMINISTRADOR
    static async findByDishName({ name, category }) {

        try {
            // let sql = `SELECT dishes.id_dish, dishes.dishes_name, dishes.description, dishes.price, dishes.available, dishes.image_url, dishes.created_at, category.id_category, category.category_name FROM dishes JOIN category ON dishes.category_id = category.id_category  ORDER BY dishes.id_dish ASC`
            // if (name) {
            //     let nameFilter = name.join("' , '")
            //     sql += ` AND name IN()`
            // }
            const searchName = '%' + name + '%';
            const searchLowerCase = searchName.toLowerCase();
            console.log('valor de la busqueda:', searchName);
            const [result] = await pool.query('SELECT dishes.id_dish, dishes.dishes_name, dishes.description, dishes.price, dishes.available, dishes.image_url, dishes.created_at, category.id_category, category.category_name FROM dishes JOIN category ON dishes.category_id = category.id_category WHERE LOWER(dishes.dishes_name) LIKE ? ORDER BY dishes.id_dish ASC', [searchLowerCase]);

            console.log('Resultado de la consulta:', result); // Registro de depuración
            return result;
        } catch (error) {
            console.error('Error al obtener los platos por nombre:', error);
            throw new Error('Error al obtener los platos por nombre');
        }
    }
    //PARA EL USUARIO ADMINISTRADOR
    static async getDishByName({ dishes_name }) {
        try {
            const [result] = await pool.query('SELECT * FROM dishes WHERE dishes_name = ?', [dishes_name]);
            return result;
        } catch (error) {
            console.error('Error al obtener el plato por nombre:', error);
            throw new Error('Error al obtener el plato por nombre');
        }
    }
    //PARA EL USUARIO ADMINISTRADOR
    static async create(input) {
        try {
            const { dishes_name, description, price, image_url, created_at, id_category } = input;
            //INSERTAR EL PLATO EN LA TABLA DE PLATOS
            const [result] = await pool.query('INSERT INTO dishes(dishes_name,description,price,image_url,category_id) VALUES (?,?,?,?,?)', [dishes_name, description, price, image_url, id_category]);
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
    //PARA EL USUARIO ADMINISTRADOR
    static async update(input) {
        try {
            const { id, dishes_name, description, price, available, updated_at, id_category } = input;
            //ACTUALIZAR EL PLATO
            const [result] = await pool.query('UPDATE dishes SET dishes_name = ?, description = ?, price = ?, available = ?, updated_at = ?, category_id = ? WHERE id_dish = ?', [dishes_name, description, price, available, updated_at, id_category, id]);
            return result;
        } catch (error) {
            console.error('Error al actualizar el plato:', error);
            throw new Error('Error al actualizar el plato');
        }
    }

    static async updateImageDishes({ id, image_url }) {
        try {
            const [result] = await pool.query('UPDATE dishes SET image_url = ? WHERE id_dish = ?', [image_url, id]);
            return result;
        } catch (error) {
            console.error('Error al actualizar la imagen del plato:', error);
            throw new Error('Error al actualizar la imagen del plato');
        }
    }
    //PARA EL USUARIO ADMINISTRADOR
    static async delete({ id }) {
        try {
            const [result] = await pool.query('UPDATE dishes SET available = 0 WHERE id_dish = ?', [id]);

            return result;
        } catch (error) {
            console.error('Error al eliminar el plato:', error);
            throw new Error('Error al eliminar el plato');
        }
    }

}