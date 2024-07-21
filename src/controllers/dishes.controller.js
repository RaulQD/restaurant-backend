import mongoose from 'mongoose'
import { Dishes } from '../models/Dishes.js'
import { Category } from '../models/Category.js'

export class DishesController {
  static async createDishes (req, res) {
    try {
      const { name, category, image } = req.body
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
      dishes.category = category
      await dishes.save()
      return res.status(201).json({ message: 'Plato creado exitosamente', status: 201, data: dishes })
    } catch (error) {
      console.error('Error al crear el plato:', error)
    }
  }

  static async getDishes (req, res) {
    try {
      const dishes = await Dishes.find({})
      res.json(dishes)
    } catch (error) {
      console.error('Error al obtener los platos:', error)
      return res.status(500).json({ message: 'Error al obtener los platos:', status: 500, route: req.originalUrl })
    }
  }

  static async getDishById (req, res) {
    try {
      const { id } = req.params
      const dishesId = mongoose.Types.ObjectId.isValid(id)
      if (!dishesId) {
        const error = new Error('El id del plato no es validoe')
        return res.status(400).json({ error: error.message, status: 400 })
      }
      const dish = await Dishes.findById(id)
      if (!dish) {
        const error = new Error('El plato no existe')
        return res.status(404).json({ error: error.message, status: 404 })
      }
      return res.status(200).json(dish)
    } catch (error) {
      console.error('Error al obtener el plato:', error)
      return res.status(500).json({ message: 'Error al obtener el plato:', status: 500, route: req.originalUrl })
    }
  }

  static async updateDishes (req, res) {
    try {
      const { id } = req.params
      const { name } = req.body
      const dishesId = mongoose.Types.ObjectId.isValid(id)
      if (!dishesId) {
        const error = new Error('El id del plato no es valido.')
        return res.status(400).json({ error: error.message, status: 400 })
      }
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
      await dish.save()
      return res.status(200).json({ message: 'Plato actualizado exitosamente', status: 200 })
    } catch (error) {
      console.error('Error al actualizar el plato:', error)
      return res.status(500).json({ message: 'Error al actualizar el plato:', status: 500, route: req.originalUrl })
    }
  }

  static async removeDishes (req, res) {
    try {
      const { id } = req.params
      const dishesId = mongoose.Types.ObjectId.isValid(id)
      if (!dishesId) {
        const error = new Error('El id del plato no es valido.')
        return res.status(400).json({ error: error.message, status: 400 })
      }
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
}
