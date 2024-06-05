import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const uploadFile = (files, allowedExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'], folder = '') => {
    return new Promise((resolve, reject) => {

        const { file } = files;

        const nameSplit = file.name.split('.');
        const fileExtension = nameSplit[nameSplit.length - 1]

        if (!allowedExtensions.includes(fileExtension)) {
            return reject(`La extensión del archivo ${fileExtension} no esta permitida. Porfavor usa uno de los permitidos ${allowedExtensions}`);
        }

        const fileName = uuid() + '.' + fileExtension;
        const uploadPath = path.join(__dirname, '../../uploads', folder, fileName);


        file.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }
            resolve(fileName);
        });
    });
}