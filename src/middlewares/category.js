import mongoose from 'mongoose'
import { Category } from '../models/Category.js'

export const validateCategoryExist = async (req, res, next) => {
  try {
    const { id } = req.params
    const category = await Category.findById(id)
    if (!category) {
      const error = new Error(' La categoria no existe')
      return res.status(404).json({ error: error.message, status: 404 })
    }
    req.category = category
    next()
  } catch (error) {
    console.error('Error al obtener la categoria:', error)
    return res.status(500).json({ message: 'Error al obtener la categoria:', status: 500, route: req.originalUrl })
  }
}

export const validateCategoryIdExist = async (req, res, next) => {
  try {
    const { id } = req.params
    const categoryId = mongoose.Types.ObjectId.isValid(id)
    if (!categoryId) {
      const error = new Error('El id de la categoria no es valido')
      return res.status(400).json({ error: error.message, status: 400 })
    }
    next()
  } catch (error) {
    console.error('Error al obtener la categoria:', error)
    return res.status(500).json({ message: 'Error al obtener la categoria:', status: 500, route: req.originalUrl })
  }
}

export const validateFieldsCategory = (req, res, next) => {
  const { name } = req.body

  if (!name) {
    return res.status(400).json({ message: 'Ingresa el nombre de la categoria', status: 400 })
  }
  if (typeof name !== 'string') {
    return res.status(400).json({ message: 'La categoria debe contener solo letras.' })
  }
  if (name.length < 4) {
    return res.status(400).json({ message: 'La categoria debe tener por lo menos 4 caracteres.' })
  }
  next()
}
