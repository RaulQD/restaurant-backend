import { response, request } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL);

import { uploadFile } from '../helpers/upload-file.js';
import { DishesModel } from '../models/dishes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
                //OBTENER EL PRIMER ELEMENTO DEL ARRAY
                models = models[0];
                break;
            default:
                return res.status(500).json({ msg: 'Se me olvido validar esto' })
        }

        //VALIDAR SI EXISTE UNA IMAGEN ANTERIOR
        if (models.image_url) {
            //ELIMINAR IMAGEN ANTERIOR
            const imagePath = path.join(__dirname, '../../uploads/', type, models.image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        //ACTUALIZAR IMAGEN
        const image_url = await uploadFile(req.files, undefined, type)
        models.image_url = image_url;

        //GUARDAR EN LA BASE DE DATOS
        await DishesModel.updateImageDishes({ id, image_url })
        res.json(models);
    }
    static async updateImageCloudinary(req = request, res = response) {
        const { type, id } = req.params;

        let models;
        switch (type) {
            case 'dishes':
                models = await DishesModel.getDishById({ id });
                if (!models || models.length === 0) {
                    return res.status(400).json({ msg: `No existe un plato con el id ${id}` })
                }
                //OBTENER EL PRIMER ELEMENTO DEL ARRAY
                models = models[0];
                break;
            default:
                return res.status(500).json({ msg: 'Se me olvido validar esto' })
        }

        if (models.image_url) {
            const nameArr = models.image_url.split('/');
            const name = nameArr[nameArr.length - 1];
            const [public_id] = name.split('.');
            cloudinary.uploader.destroy(public_id);
        }

        const { tempFilePath } = req.files.file;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath)
        models.image_url = secure_url;
        await DishesModel.updateImageDishes({ id, image_url: secure_url })
        res.json(models);
    }

    static async getImage(req = request, res = response) {

        const { type, id } = req.params;

        let models;
        switch (type) {
            case 'dishes':
                models = await DishesModel.getDishById({ id });
                if (!models || models.length === 0) {
                    return res.status(400).json({ msg: `No existe un plato con el id ${id}` })
                }
                //OBTENER EL PRIMER ELEMENTO DEL ARRAY
                models = models[0];
                break;
            default:
                return res.status(500).json({ msg: 'Se me olvido validar esto' })
        }
        //VALIDAR SI EXISTE UNA IMAGEN ANTERIOR
        if (models.image_url) {
            //ELIMINAR IMAGEN ANTERIOR
            const imagePath = path.join(__dirname, '../../uploads/', type, models.image_url);
            if (fs.existsSync(imagePath)) {
                return res.sendFile(imagePath)
            }
        }
        //IMAGEN POR DEFECTO
        const defaultImagePath = path.join(__dirname, '../assets/no-image.jpg');
        return res.sendFile(defaultImagePath)

    }
}