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
