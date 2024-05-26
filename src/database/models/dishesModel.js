import conn from '../mysql-db.js';

export class DishesModel {

    static async getAllDishes({ categoryName }) {
        try {
            //SI SE PASA UNA CATEGORIA COMO PARAMETRO 
            if (categoryName) {
                //CONVERTIR EL NOMBRE DE LA CATEGORIA A MINUSCULAS
                const lowerCaseCategoryName = categoryName.toLowerCase();

                //OBTENER LOS PLATOS POR NOMBRE DE CATEGORIA
                const [filterDishesByCategoryName] = await conn.query('SELECT dishes.id_dish, dishes.dishesName, dishes.description, dishes.price, dishes.enable, dishes.createAt, categorydishes.id_category, categorydishes.categoryName FROM dishes JOIN categorydishes ON dishes.id_category = categorydishes.id_category WHERE LOWER(categorydishes.categoryName) =  ?;', [lowerCaseCategoryName]);
                console.log(filterDishesByCategoryName);

                if (filterDishesByCategoryName.length === 0) {
                    return [];
                }
                return filterDishesByCategoryName;
            }
            //OBTENER TODOS LOS PLATOS DE LA BASE DE DATOS SI NO SE PASA NINGUNA CATEGORIA
            const [dishes] = await conn.query('SELECT dishes.id_dish, dishes.dishesName, dishes.description, dishes.price, dishes.enable, dishes.createAt, categorydishes.id_category, categorydishes.categoryName FROM dishes JOIN categorydishes ON dishes.id_category = categorydishes.id_category');

            return dishes;
        } catch (error) {
            if (error.code === 'ER_BAD_FIELD_ERROR')
                console.error('Error al obtener los platos:', error);
            throw new Error('Error al obtener los platos');
        }
    }
    static async getDishById({ id }) {
        try {
            const [getDishById] = await conn.query('SELECT dishes.id_dish, dishes.dishesName, dishes.description, dishes.price, dishes.enable,dishes.createAt, categorydishes.id_category, categorydishes.categoryName FROM dishes JOIN categorydishes ON dishes.id_category = categorydishes.id_category WHERE id_dish = ?', [id]);
            //SI NO SE ENCUENTRA NINGUN PLATO CON EL ID PROPORCIONADO
            if (!getDishById || getDishById.length === 0) {
                return [];
            }
            //OBJETER EL RESULTADO EN UN OBJETO CON EL FORMATO DESEADO
            const dish = {
                id: getDishById[0].id_dish,
                nombre: getDishById[0].dishesName,
                descripcion: getDishById[0].description,
                precio: getDishById[0].price,
                estado: getDishById[0].enable,
                fechaCreacion: getDishById[0].createAt,
                categoria: {
                    id: getDishById[0].id_category,
                    categoria: getDishById[0].categoryName
                }
            }
            return dish;
        } catch (error) {
            console.error('Error al obtener el plato por ID:', error);
            throw new Error('Error al obtener el plato por ID');
        }
    }

    static async getDishByName({ dishesName }) {
        try {
            const [getDishByName] = await conn.query('SELECT * FROM dishes WHERE dishesName = ?', [dishesName]);
            return getDishByName;
        } catch (error) {
            console.error('Error al obtener el plato por nombre:', error);
            throw new Error('Error al obtener el plato por nombre');
        }
    }
    static async create(input) {
        try {
            const { dishesName, description, price, enable, id_category } = input;
            //ESTABLECER UN VALOR POR DEFECTO PARA EL CAMPO enable
            const enableValue = enable ?? 'Active';
            const [result] = await conn.query('INSERT INTO dishes (dishesName, description, price, enable, id_category) VALUES ( ?, ?, ? ,?, ?)', [dishesName, description, price, enableValue, id_category])

            return { id: result.insertId, dishesName, description, price, enable: enableValue, id_category };
        } catch (error) {
            console.log(error);
            throw new Error('Error al crear un plato');
        }
    }

    static async update(input) {
        try {
            const { id, dishesName, description, price, enable, id_category } = input;
            const [result] = await conn.query('UPDATE dishes SET dishesName = ?, description = ?, price = ?, enable = ?, id_category = ? WHERE id_dish = ?', [dishesName, description, price, enable, id_category, id]);
            return result;
        } catch (error) {
            console.error('Error al actualizar el plato:', error);
            throw new Error('Error al actualizar el plato');
        }
    }
    static async delete({ id }) {
        try {
            const [result] = await conn.query('DELETE FROM dishes WHERE id_dish = ?', [id]);
            console.log(result);
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