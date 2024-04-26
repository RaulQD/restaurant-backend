import { DishesModel } from "../database/models/dishesModel.js";


export class DishesController {

    static async getDishes(req, res) {
        try {
            const { categoryName } = req.query;
            const dishes = await DishesModel.getAllDishes({ categoryName });
            console.log(dishes);
            res.json(dishes);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    }
    static async getDishById(req, res) {
        try {
            const { id } = req.params;

            //VALIDA QUE EL ID SEA UN NUMERO POSITIVO Y NO UNA CADENA DE TEXTO
            if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
                return res.status(400).json({ message: "Id must be a positive integer" });
            }
            const dish = await DishesModel.getDishById({ id });
            //SI NO SE ENCUENTRA NINGUN PLATO CON EL ID PROPORCIONADO
            if (dish.length === 0) {
                return res.status(404).json({ message: `Dish with id ${id} not found`, status: 404 });
            }
            res.json(dish);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    }
    static async createDish(req, res) {
        try {
            const { nombre, descripcion, precio, id_categoria } = req.body;
            //VALIDAR QUE LOS CAMPOS NO ESTEN VACIOS
            if (!nombre || !descripcion || !precio || !id_categoria) {
                return res.status(400).json({ message: 'All fields are required', status: 400 });
            }
            //VALIDAR SI UN PLATO EXISTE

            //TODO -> ARREGLAR LA VALIDACION DE SI UN PLATO EXISTE EL PLATO NO EXISTE Y ME SIGUE RETORNANDO EL ERROR
            const dishExist = await DishesModel.getDishById(nombre);
            if (dishExist) {
                const error = new Error('Dish already exists');
                return res.status(400).json({ message: error.message, status: 400 });
            }
            //VALIDAR QUE EL PRECIO SEA UN NUMERO POSITIVO
            if (typeof precio === 'number' || precio <= 0) {
                console.log('Precio debe ser un numero positivo')
            }
            //CREAR UN NUEVO PLATO
            const newDish = await DishesModel.creatDish({ nombre, descripcion, precio, id_categoria });

            res.status(201).json(newDish);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message, status: 500 });
        }
    }

}