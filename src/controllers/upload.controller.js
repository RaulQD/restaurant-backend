import fs from 'fs'
import { deleteImage, uploadImage } from '../helpers/cloudinary.js'
import { Dishes } from '../models/Dishes.js'

export class UploadController {
  static async uploadImageDishes (req, res) {
    const { id } = req.params

    // VALIDAR QUE EXISTA EL ID EN LOS PARAMETROS
    const dish = await Dishes.findById(id)
    if (!dish) {
      const error = new Error(`El plato con el id ${id} no existe`)
      return res.status(404).json({ error: error.message })
    }
    const file = req.files.images
    if (dish.images) {
      const nameArr = dish.images.split('/')
      const nameImage = nameArr[nameArr.length - 1]
      const [public_id] = nameImage.split('.')
      await deleteImage(public_id)
    }
    const { tempFilePath } = file
    const { secure_url } = await uploadImage(tempFilePath)
    dish.images = secure_url
    fs.unlinkSync(tempFilePath)
    await dish.save()
    return res.status(200).json({ message: 'Imagen subida exitosamente', data: dish })
  }
}
