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
      const { category, page = 1, limit = 10, keyword } = req.query
      const query = { status: 'active' }
      // CONVERTIR EL LIMIT Y PAGE A NUMEROS
      const limitNumber = Number(limit)
      const pageNumber = Number(page)

      if (keyword) {
        query.name = { $regex: keyword, $options: 'i' }
      }
      if (category) {
        const categoryExist = await Category.findOne({ name: { $regex: category, $options: 'i' } })
        if (categoryExist) query.category = categoryExist._id
      }

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
      const { id } = req.params
      const dish = await Dishes.findById(id).populate('category')
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
      const { name } = req.body
      if (name) {
        const dishWithSameName = await Dishes.findOne({ name, _id: { $ne: req.dish.id } })
        if (dishWithSameName) {
          const error = new Error('El nombre del plato ya existe.')
          return res.status(409).json({ error: error.message, status: 409 })
        }
      }
      const dish = await req.dish.save()
      return res.status(200).json({ message: 'Plato actualizado exitosamente', status: 200, data: dish })
    } catch (error) {
      return res.status(500).json({ error: error.message, status: 500, route: req.originalUrl })
    }
  }

  static async removeDishes (req, res) {
    try {
      await req.dish.deleteOne()
      return res.status(200).json({ message: 'Plato eliminado exitosamente', status: 200 })
    } catch (error) {
      return res.status(500).json({ error: error.message, status: 500, route: req.originalUrl })
    }
  }

  static async updatedDishesStatus (req, res) {
    try {
      const { status } = req.body
      req.dish.status = status
      await req.dish.save()
      return res.status(200).json({ message: 'Plato actualizado', status: 200 })
    } catch (error) {
      return res.status(500).json({ error: error.message, status: 500, route: req.originalUrl })
    }
  }

  static async getDishesByCategoryName (req, res) {
    try {
      const { category } = req.query

      // VALIDAR SI LA CATEGORIA ESTA VACIA
      if (!category) {
        const dishes = await Dishes.find().populate('category')
        if (!dishes.length) {
          const error = new Error('No hay platos en esta categoria')
          return res.status(404).json({ error: error.message, status: 404 })
        }
        return res.json(dishes)
      }
      // VALIDAR SI LA CATEGOIA EXISTE
      const categoryExist = await Category.findOne({ name: category })
      if (!categoryExist) {
        const error = new Error('La categoria no existe')
        return res.status(404).json({ error: error.message, status: 404 })
      }
      // OBTENER EL ID DE LA CATEGORIA
      const categoryID = categoryExist._id
      // OBTENER LOS PLATOS DE LA CATEGORIA
      const dishes = await Dishes.find({ category: categoryID }).populate('category')
      if (!dishes.length) {
        const error = new Error('No hay platos en esta categoria')
        return res.status(404).json({ error: error.message, status: 404 })
      }
      return res.json(dishes)
    } catch (error) {
      return res.status(500).json({ error: error.message, status: 500, route: req.originalUrl })
    }
  }
}
