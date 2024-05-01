import { DishesModel } from "../database/models/dishesModel.js";
import validatorsErrors from "../validations/validatorsErros.js";


export class DishesController {

    static async getDishes(req, res) {
        try {
            const { categoryName } = req.query;
            const dishes = await DishesModel.getAllDishes({ categoryName });
            console.log(dishes);
            res.status(200).json(dishes);
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
            //SI SE ENCUENTRA UN PLATO CON EL ID PROPORCIONADO
            if (dish) return res.json(dish);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    }
    static async create(req, res) {
        try {
            const { dishesName, description, price, enable, id_category } = req.body;

            //*VALIDAR SI EL PLATO YA EXISTE EN LA BASE DE DATOS
            const dishExist = await DishesModel.getDishByName({ dishesName });
            if (dishExist.length) {
                console.log(dishExist);
                return res.status(400).json({ message: 'Dish already exists', status: 400 });
            }

            //*CREAR UN NUEVO PLATO
            const newDish = await DishesModel.create({ dishesName, description, price, enable, id_category });
            res.status(201).json({ message: 'Dish created successfully', status: 201, newDish: newDish });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message, status: 500 });
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { dishesName, description, price, enable, id_category } = req.body;

            //* OBTENER EL ID DEL PLATO PARA VALIDAR QUE EXISTA
            const dish = await DishesModel.getDishById({ id });
            if (!dish) {
                return res.status(404).json({ message: `Dish with id ${id} not found`, status: 404 });
            }
            //* VALIDAR SI EL PLATO YA EXISTE EN LA BD CASO CONTRARIO ACTUALIZARLO
            if (dishesName !== dish.nombre) {
                const dishWithSameName = await DishesModel.getDishByName({ dishesName });
                if (dishWithSameName.length) {
                    return res.status(400).json({ message: 'Dish already exists', status: 400 });
                }
            }
            const updateDish = await DishesModel.update({ dishesName, description, price, enable, id_category, id });
            res.json({ message: 'Dish updated successfully', status: 200, updateDish });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message, status: 500 });
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const dish = await DishesModel.delete({ id });
            if (dish.affectedRows > 0) {
                return res.json({ message: `Dish with id ${id} deleted successfully`, status: 200 });
            }
            return res.status(404).json({ message: `Dish with id ${id} not found`, status: 404 });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message, status: 500 });
        }
    }
}