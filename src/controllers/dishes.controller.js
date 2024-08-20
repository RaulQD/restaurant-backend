import fs from 'fs'
import { request, response } from 'express'
import { Dishes, statusDishes } from '../models/Dishes.js'
import { Category } from '../models/Category.js'
import { deleteImage, uploadImage } from '../utils/cloudinary.js'

export class DishesController {
  static async createDishes (req, res) {
    try {
      const { name, category } = req.body
      const nameExist = await Dishes.findOne({ name })
      if (nameExist) {
        const error = new Error('El plato ya existe')
        return res.status(409).json({ error: error.message, status: 409, routes: req.originalUrl })
      }
      const categoryExist = await Category.findById(category)
      if (!categoryExist) {
        const error = new Error('La categoria no existe')
        return res.status(404).json({ error: error.message, status: 404 })
      }
      const dishes = new Dishes(req.body)
      dishes.user = req.user._id
      dishes.category = category
      await dishes.save()
      return res.status(201).json({ message: 'Plato creado exitosamente', status: 201, data: dishes })
    } catch (error) {
      return res.status(500).json({ error: error.messag, status: 500, route: req.originalUrl })
    }
  }

  static async getDishes (req, res) {
    try {
      const { page = 1, limit = 10 } = req.query
      const query = { status: 'active' }
      // CONVERTIR EL LIMIT Y PAGE A NUMEROS
      const limitNumber = Number(limit)
      const pageNumber = Number(page)

      const [dishes, totalDishes] = await Promise.all([
        Dishes.find(query)
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('user', 'firstName lastName')
          .populate('category'),
        Dishes.countDocuments(query)
      ])
      return res.json({ result: dishes, pagination: { page: pageNumber, limit: limitNumber, totalDishes } })
    } catch (error) {
      return res.status(500).json({ error: error.message, status: 500, route: req.originalUrl })
    }
  }

  static async getDishById (req, res) {
    try {
      const dish = await Dishes.findById(req.params.id)
      if (!dish) {
        const error = new Error('Plato no encontrado')
        return res.status(404).json({ error: error.message })
      }
      return res.status(200).json(dish)
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener el plato:', status: 500, route: req.originalUrl })
    }
  }

  static async updateDishes (req, res) {
    try {
      const { id } = req.params
      const { name } = req.body
      if (name) {
        const dishWithSameName = await Dishes.findOne({ name, _id: { $ne: id } })
        if (dishWithSameName) {
          const error = new Error('El nombre del plato ya existe.')
          return res.status(409).json({ error: error.message, status: 409 })
        }
      }
      const dish = await Dishes.findByIdAndUpdate(id, req.body)
      if (!dish) {
        const error = new Error('El plato no existe.')
        return res.status(404).json({ error: error.message, status: 404 })
      }
      // ACTUALIZAR UNA IMAGEN
      // if (req.files?.images) {
      //   const nameArr = dish.images.split('/')
      //   const nameFile = nameArr[nameArr.length - 1]
      //   const [public_id] = nameFile.split('.')
      //   await deleteImage(public_id)
      // }
      // const { tempFilePath } = req.files.images
      // const { secure_url } = await uploadImage(tempFilePath)
      // fs.unlinkSync(tempFilePath)
      // dish.images = secure_url
      await dish.save()
      return res.status(200).json({ message: 'Plato actualizado exitosamente', status: 200, data: dish })
    } catch (error) {
      return res.status(500).json({ error: error.message, status: 500, route: req.originalUrl })
    }
  }

  static async removeDishes (req, res) {
    try {
      const { id } = req.params
      const dish = await Dishes.findById(id)
      if (!dish) {
        const error = new Error('El plato no existe.')
        return res.status(404).json({ error: error.message, status: 404 })
      }
      await dish.deleteOne()
      return res.status(200).json({ message: 'Plato eliminado exitosamente', status: 200 })
    } catch (error) {
      return res.status(500).json({ error: error.message, status: 500, route: req.originalUrl })
    }
  }

  static async updatedDishesStatus (req, res) {
    try {
      const { id } = req.params
      const { status } = req.body
      // VALIDAR SI EL ESTADO ES VALIDO
      const validStatus = Object.values(statusDishes)
      if (!validStatus.includes(status.toLowerCase())) {
        const error = new Error('El estado del plato no es valido ')
        return res.status(400).json({ error: error.message, status: 400 })
      }
      // ACTUALIZAR EL ESTADO DEL PLATO
      const dishStatus = await Dishes.findByIdAndUpdate(id, { status: status.toLowerCase() })
      if (!dishStatus) {
        const error = new Error('El plato no existe')
        return res.status(404).json({ error: error.message, status: 404 })
      }
      await dishStatus.save()
      return res.status(200).json({ message: 'Estado  actualizado exitosamente', status: 200 })
    } catch (error) {
      return res.status(500).json({ error: error.message, status: 500, route: req.originalUrl })
    }
  }
}
