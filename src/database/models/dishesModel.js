import conn from '../mysql-db.js';

export class DishesModel {

    static async getAllDishes({ categoryName }) {
        try {
            //SI SE PASA UNA CATEGORIA COMO PARAMETRO 
            if (categoryName) {
                //CONVERTIR EL NOMBRE DE LA CATEGORIA A MINUSCULAS
                const lowerCaseCategoryName = categoryName.toLowerCase();
                //OBTENER LOS PLATOS POR NOMBRE DE CATEGORIA
                const [filterDishesByCategoryName] = await conn.query
                    ('SELECT platos.id_plato, platos.nombre, platos.descripcion, platos.precio, categoriasplatos.nombre FROM platos JOIN categoriasplatos ON platos.id_categoria = categoriasplatos.id_categoria WHERE categoriasplatos.nombre = ?', [lowerCaseCategoryName]);
                if (filterDishesByCategoryName.length === 0) {
                    return [];
                }
                return filterDishesByCategoryName;
            }
            //OBTENER TODOS LOS PLATOS DE LA BASE DE DATOS SI NO SE PASA NINGUNA CATEGORIA
            const [dishes] = await conn.query('SELECT id_plato, nombre, descripcion, precio, id_categoria FROM platos');
            return dishes;
        } catch (error) {
            console.error('Error al obtener los platos:', error);
            throw new Error('Error al obtener los platos');
        }
    }
    static async getDishById({ id }) {
        try {
            const [getDishById] = await conn.query('SELECT * FROM platos WHERE id_plato = ?', [id]);
            if (getDishById.length === 0) {
                return [];
            }
            return getDishById;
        } catch (error) {
            console.error('Error al obtener el plato por ID:', error);
            throw new Error('Error al obtener el plato por ID');
        }
    }
    static async creatDish(input) {
        try {
            const { nombre, descripcion, precio, id_categoria } = input;
            const [newDish] = await conn.query(
                'INSERT INTO Platos (nombre, descripcion, precio, id_categoria) VALUES (?, ?, ?, ?)', [nombre, descripcion, precio, id_categoria])
            return newDish;
        } catch (error) {
            console.log(error);
            throw new Error('Error al crear un plato');
        }
    }

}