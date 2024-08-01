import mongoose from 'mongoose'

export const validateDishesIdExist = async (req, res, next) => {
  try {
    const { id } = req.params
    const dishesId = mongoose.Types.ObjectId.isValid(id)
    if (!dishesId) {
      const error = new Error('El id de la plato no es valido')
      return res.status(400).json({ error: error.message, status: 400 })
    }
    next()
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener la plato', status: 500, route: req.originalUrl })
  }
}

export const validateDishes = (req, res, next) => {
  const { name, description, originalPrice } = req.body

  if (!name) {
    return res.status(400).json({ message: 'Ingresa el nombre del plato', status: 400 })
  }
  if (typeof name !== 'string') {
    return res.status(400).json({ message: 'El plato debe contener solo letras.' })
  }
  if (name.length < 4) {
    return res.status(400).json({ message: 'El plato debe tener por lo menos 4 caracteres.' })
  }
  if (!description) {
    return res.status(400).json({ message: 'Ingresa la descripción del plato.', status: 400 })
  }
  if (description.length < 20) {
    return res.status(400).json({ message: 'La descripción del plato debe tener por lo menos 20 caracteres.', status: 400 })
  }
  if (!originalPrice) {
    return res.status(400).json({ message: 'Ingresa el precio del plato,', status: 400 })
  }
  if (isNaN(parseFloat(originalPrice))) {
    return res.status(400).json({ message: 'El precio no es valido.', status: 400 })
  }
  next()
}
