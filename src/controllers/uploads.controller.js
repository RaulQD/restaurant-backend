import { response, request } from 'express';

import { uploadFile } from '../helpers/upload-file.js';
import { DishesModel } from '../database/models/dishesModel.js';


export class UploadsController {

    static async uploadFile(req = request, res = response) {
        try {
            const fileName = await uploadFile(req.files, undefined, 'imgs');
            res.json({ fileName });
        } catch (err) {
            res.status(400).json({ msg: err })
        }
    };
    static async updateImage(req = request, res = response) {

        const { type, id } = req.params;

        let models;
        switch (type) {
            case 'dishes':
                models = await DishesModel.getDishById({ id });
                if (!models || models.length === 0) {
                    return res.status(400).json({ msg: `No existe un plato con el id ${id}` })
                }
                break;
            default:
                return res.status(500).json({ msg: 'Se me olvido validar esto' })
        }
        //ACTUALIZAR IMAGEN
        const image_url = await uploadFile(req.files, undefined, type)
        models.image_url = image_url;

        //GUARDAR EN LA BASE DE DATOS
        await DishesModel.update({ id, image_url: image_url });
        res.json(models);
    }
}