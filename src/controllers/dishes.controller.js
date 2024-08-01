import fs from 'fs'
import { request, response } from 'express'
import { Dishes, statusDishes } from '../models/Dishes.js'
import { Category } from '../models/Category.js'
import { deleteImage, uploadImage } from '../helpers/cloudinary.js'

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
      // AGREGAR UNA IMAGEN
      if (req.files?.images) {
        const { tempFilePath } = req.files.images
        const result = await uploadImage(tempFilePath)
        dishes.images = result.secure_url
        fs.unlinkSync(tempFilePath)
      }
      dishes.category = category
      await dishes.save()
      return res.status(201).json({ message: 'Plato creado exitosamente', status: 201, data: dishes })
    } catch (error) {
      console.error('Error al crear el plato:', error)
      return res.status(500).json({ message: 'Error al crear el plato:', status: 500, route: req.originalUrl })
    }
  }

  static async getDishes (req, res) {
    try {
      const { page = 1, limit = 10 } = req.query
      // CONVERTIR A NUMEROS

      const query = { status: 'active' }
      const [dishes, totalDishes] = await Promise.all([
        Dishes.find(query)
          .skip((Number(page) - 1) * Number(limit))
          .limit(Number(limit))
          .populate('category'),
        Dishes.countDocuments(query)
      ])

      const data = dishes.map(dish => ({
        id: dish._id,
        name: dish.name,
        originalPrice: dish.originalPrice,
        description: dish.description,
        available: dish.available,
        status: dish.status,
        category: dish.category,
        images: dish.images
      }))
      return res.json({ result: data, pagination: { page, limit, totalDishes } })
    } catch (error) {
      console.error('Error al obtener los platos:', error)
      return res.status(500).json({ message: 'Error al obtener los platos:', status: 500, route: req.originalUrl })
    }
  }

  static async getDishById (req, res) {
    try {
      const dish = await Dishes.findById(req.params.id).populate('category')
      if (!dish) {
        const error = new Error('El plato no existe')
        return res.status(404).json({ error: error.message, status: 404 })
      }
      return res.status(200).json({ status: 'success', lenght: dish.length, data: { dish } })
    } catch (error) {
      console.error('Error al obtener el plato:', error)
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
      if (req.files?.images) {
        const nameArr = dish.images.split('/')
        const nameFile = nameArr[nameArr.length - 1]
        const [public_id] = nameFile.split('.')
        await deleteImage(public_id)
      }
      const { tempFilePath } = req.files.images
      const { secure_url } = await uploadImage(tempFilePath)
      fs.unlinkSync(tempFilePath)
      dish.images = secure_url
      await dish.save()
      return res.status(200).json({ message: 'Plato actualizado exitosamente', status: 200, data: dish })
    } catch (error) {
      console.error('Error al actualizar el plato:', error)
      return res.status(500).json({ message: 'Error al actualizar el plato:', status: 500, route: req.originalUrl })
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
      console.error('Error al eliminar el plato:', error)
      return res.status(500).json({ message: 'Error al eliminar el plato:', status: 500, route: req.originalUrl })
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
      console.error('Error al actualizar el estado del plato:', error)
      return res.status(500).json({ message: 'Error al actualizar el estado del plato:', status: 500, route: req.originalUrl })
    }
  }
}
