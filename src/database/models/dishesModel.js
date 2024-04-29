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
                    ('SELECT platos.id_plato, platos.nombrePlato, platos.descripcion, platos.precio, categoriasplatos.id_categoria, categoriasplatos.nombreCategoria FROM platos JOIN categoriasplatos ON platos.id_categoria = categoriasplatos.id_categoria WHERE categoriasplatos.nombreCategoria = ?', [lowerCaseCategoryName]);

                if (filterDishesByCategoryName.length === 0) {
                    return [];
                }
            }
            //OBTENER TODOS LOS PLATOS DE LA BASE DE DATOS SI NO SE PASA NINGUNA CATEGORIA
            const [dishes] = await conn.query('SELECT id_plato, nombrePlato, descripcion, precio, id_categoria FROM platos');
            //MAPEAR LOS PLATOS PARA QUE TENGAN EL FORMATO DESEADO
            const dish = dishes.map(dish => {
                return {
                    id: dish.id_plato,
                    nombre: dish.nombrePlato,
                    descripcion: dish.descripcion,
                    precio: dish.precio,
                    categoria: {
                        id: dish.id_categoria,
                        nombre: dish.nombreCategoria
                    }
                }
            })
            return dish;
        } catch (error) {
            console.error('Error al obtener los platos:', error);
            throw new Error('Error al obtener los platos');
        }
    }
    static async getDishById({ id }) {
        try {

            const [getDishById] = await conn.query('SELECT * FROM platos WHERE id_plato = ?', [id]);
            console.log(getDishById)
            return getDishById;
        } catch (error) {
            console.error('Error al obtener el plato por ID:', error);
            throw new Error('Error al obtener el plato por ID');
        }
    }

    static async getDishByName({ nombrePlato }) {
        try {


            const [getDishByName] = await conn.query('SELECT * FROM platos WHERE nombrePlato = ?', [nombrePlato]);
            return getDishByName;
        } catch (error) {
            console.error('Error al obtener el plato por nombre:', error);
            throw new Error('Error al obtener el plato por nombre');
        }
    }
    static async createDish(input) {
        try {
            const { nombrePlato, descripcion, precio, id_categoria } = input;
            const newDish = {
                nombrePlato,
                descripcion,
                precio,
                id_categoria
            }

            await conn.query(
                'INSERT INTO Platos set ?', [newDish])
            console.log(newDish);
            return newDish;
        } catch (error) {
            console.log(error);
            throw new Error('Error al crear un plato');
        }
    }

}