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
