import { DishesModel } from "../models/dishes.js";
import { uploadFile } from "../helpers/upload-file.js";
import { resultToObjectWish } from "../helpers/utils.js";


export class DishesController {

    static async getDishes(req, res) {
        try {
            const result = await DishesModel.getAllDishes();
            //VERIFICAR SI NO SE ENCUENTRA NINGUN PLATO
            if (result.length === 0) {
                return res.status(404).json({ message: 'No se encontraron platos', status: 404, route: req.originalUrl });
            }
            //OBJETER EL RESULTADO EN UN OBJETO CON EL FORMATO DESEADO
            const dishes = result.map(resultToObjectWish);
            res.status(200).json(dishes);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async getDishesAvailable(req, res) {
        try {
            const result = await DishesModel.getAllDishesAvailable();
            if (result.length === 0) {
                return res.status(404).json({ message: 'No se encontraron platos disponibles', status: 404, route: req.originalUrl });
            }
            //OBJETER EL RESULTADO EN UN OBJETO CON EL FORMATO DESEADO
            const dishes = result.map(resultToObjectWish);

            return res.status(200).json(dishes);
        } catch (error) {
            console.error('Error al obtener los platos disponibles:', error);
            res.status(500).json({ message: 'Internal server error', status: 500, route: req.originalUrl });
        }
    }
    static async getDishesByCategoryName(req, res) {
        try {
            const { category } = req.query;

            const dishesByCategoryName = await DishesModel.getDishByCategoryName({ category });
            if (dishesByCategoryName.length === 0) {
                return res.status(404).json({ message: `No se encontraron platos con la categoria: ${category}`, status: 404, route: req.originalUrl, result: dishesByCategoryName });
            }
            //OBJETER EL RESULTADO EN UN OBJETO CON EL FORMATO DESEADO
            const result = dishesByCategoryName.map(resultToObjectWish);

            //RETORNAR EL RESULTADO
            return res.status(200).json({ status: 200, route: req.originalUrl, result });
        } catch (error) {
            console.error('Error al obtener los platos por categoria:', error);
            return res.status(500).json({ message: 'Internal server error', status: 500, route: req.originalUrl });
        }
    }
    static async getDishById(req, res) {
        try {
            const { id } = req.params;
            //VALIDA QUE EL ID SEA UN NUMERO POSITIVO Y NO UNA CADENA DE TEXTO
            if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
                return res.status(400).json({ message: "El id proporcionado no es valido", status: 400 },);
            }
            const result = await DishesModel.getDishById({ id });
            //SI NO SE ENCUENTRA NINGUN PLATO CON EL ID PROPORCIONADO
            if (result.length === 0) {
                return res.status(404).json({ message: `El plato con el id ${id} no existe`, status: 404 });
            }
            //OBJETER EL RESULTADO EN UN OBJETO CON EL FORMATO DESEADO
            const dish = result.map(resultToObjectWish);
            //RETORNAR EL RESULTADO
            return res.status(200).json(dish[0]);
        } catch (error) {
            console.error('Error al obtener el plato por ID: ', error);
            return res.status(500).json({ message: 'Error al obtener el plato por ID:', status: 500, route: req.originalUrl });
        }

    }
    static async searchDishesByName(req, res) {
        try {
            const { name } = req.params;

            console.log({ message: 'Nombre del plato recibido', name }); // Registro de depuración
            const dishesByName = await DishesModel.findByDishName({ name });

            if (dishesByName.length === 0) {
                return res.status(400).json({ message: `No se encontraron platos con el nombre ${name}`, status: 400 })
            }

            const dishes = dishesByName.map(resultToObjectWish);

            console.log('Resultado de la consulta:', dishes); // Registro de depuración
            return res.status(200).json({ message: `Platos encontrados con el termino ${name}`, status: 200, route: req.originalUrl, dishes });
        } catch (error) {
            console.error('Error al obtener el plato por nombre:', error);
            return res.status(500).json({ message: 'Internal server error', status: 500, route: req.originalUrl });
        }
    }

    static async addDishes(req, res) {
        try {

            const { dishes_name, description, price, image_url, id_category } = req.body;

            //*VALIDAR SI EL PLATO YA EXISTE EN LA BASE DE DATOS
            const dishExist = await DishesModel.getDishByName({ dishes_name });
            if (dishExist.length) {
                console.log(dishExist);
                return res.status(400).json({ message: 'Dish already exists', status: 400 });
            }

            //* VALIDAR SI SE SELECCIONO UNA CATEGORIA
            if (!id_category) {
                return res.status(400).json({ message: 'Category is required', status: 400 });
            }
            //*CREAR UN NUEVO PLATO
            const newDish = await DishesModel.create({ dishes_name, description, price, id_category });
            return res.status(201).json({ message: 'Plato creado exitosamente', status: 201, newDish });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    static async updateDishes(req, res) {
        try {
            const { id } = req.params;
            const { dishes_name, description, price, available, id_category } = req.body;

            //* OBTENER EL ID DEL PLATO PARA VALIDAR QUE EXISTA
            const dish = await DishesModel.getDishById({ id });
            if (!dish || dish.length === 0) {
                return res.status(404).json({ message: `El Plato con el ID ${id} no existe`, status: 404 });
            }

            // * VALIDAR SI EL PLATO YA EXISTE EN LA BD CASO CONTRARIO ACTUALIZARLO
            if (dishes_name && dishes_name !== dish[0].dishes_name) {
                const dishWithSameName = await DishesModel.getDishByName({ dishes_name });
                if (dishWithSameName.length) {
                    return res.status(400).json({ message: 'El nombre del plato existe', status: 400 });
                }
            }
            const updateData = {
                id,
                dishes_name,
                description,
                price,
                available,
                updated_at: new Date(),
                id_category
            }

            const updateDish = await DishesModel.update(updateData);
            return res.json({ message: 'Plato actualizado exitosamente', status: 200, data: updateDish });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    static async updateImage(req, res) {
        try {
            const { id } = req.params;
            const { image_url } = req.body;
            const dish = await DishesModel.getDishById({ id });
            if (dish.length === 0) {
                return res.status(404).json({ message: `Dish with id ${id} not found`, status: 404 });
            }
            image_url = await uploadFile(req.files, undefined, 'dishes');
            await DishesModel.updateImageDishes({ id, image_url });
            return res.json({ message: 'Image updated successfully', status: 200 });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message, status: 500 });
        }
    }
    static async removeDishes(req, res) {
        try {
            const { id } = req.params;
            const dish = await DishesModel.delete({ id });
            if (dish.affectedRows === 0) {
                return res.status(404).json({ message: `El plato con el id ${id} no existe `, status: 404 });
            }
            return res.json({ message: `El plato con el ID ${id} ha sido eliminado exitosamente`, status: 200 });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

}