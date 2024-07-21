import mongoose from 'mongoose'
import { Category } from '../models/Category.js'

export class CategoryController {
  static async createCategory (req, res) {
    try {
      const { name } = req.body
      const nameExist = await Category.findOne({ name })
      if (nameExist) {
        const error = new Error('La categoria ya existe')
        return res.status(409).json({ error: error.message, status: 409 })
      }
      const category = new Category(req.body)
      await category.save()
      return res.status(201).json({ message: 'Categoria creada exitosamente', status: 201, data: category })
    } catch (error) {
      console.error('Error al crear la categoria:', error)
      return res.status(500).json({ message: 'Error al crear la categoria:', status: 500, route: req.originalUrl })
    }
  }

  static async getAllCategories (req, res) {
    try {
      const categories = await Category.find({})
      return res.status(200).json(categories)
    } catch (error) {
      console.error('Error al obtener las categorias:', error)
      return res.status(500).json({ message: 'Error al obtener las categorias:', status: 500, route: req.originalUrl })
    }
  }

  static async getCategoryById (req, res) {
    try {
      const { id } = req.params
      const categoryId = mongoose.Types.ObjectId.isValid(id)
      if (!categoryId) {
        const error = new Error('El id de la categoria no es valido')
        return res.status(400).json({ error: error.message, status: 400 })
      }

      return res.status(200).json({ message: 'Categoria encontrada', status: 200, data: req.category })
    } catch (error) {
      console.log('Error al obtener la categoria:', error)
      return res.status(500).json({ message: 'Error al obtener la categoria:', status: 500, route: req.originalUrl })
    }
  }

  static async updateCategory (req, res) {
    try {
      const { id } = req.params
      const { name } = req.body
      const dishesId = mongoose.Types.ObjectId.isValid(id)
      if (!dishesId) {
        const error = new Error('El id del plato no es valido.')
        return res.status(400).json({ error: error.message, status: 400 })
      }
      if (name) {
        const nameExist = await Category.findOne({ name, _id: { $ne: id } })
        if (nameExist) {
          const error = new Error('La categoria ya existe')
          return res.status(409).json({ error: error.message, status: 409 })
        }
      }
      const category = await Category.findByIdAndUpdate(id, req.body)
      if (!category) {
        const error = new Error('La categoria no existe')
        return res.status(404).json({ error: error.message, status: 404 })
      }
      await category.save()
      return res.status(200).json({ message: 'Categoria actualizada exitosamente', status: 200 })
    } catch (error) {
      console.error('Error al actualizar la categoria:', error)
      return res.status(500).json({ message: 'Error al actualizar la categoria:', status: 500, route: req.originalUrl })
    }
  }
}
