
export const validateDishes = (req, res, next) => {


  const { dishes_name, description, price } = req.body;

  if (!dishes_name) {
    return res.status(400).json({ message: 'Ingresa el nombre del plato', status: 400 })
  }
  if (typeof dishes_name !== 'string') {
    return res.status(400).json({ message: 'El plato debe contener solo letras.' })
  }
  if (dishes_name.length < 4) {
    return res.status(400).json({ message: 'El plato debe tener por lo menos 4 caracteres.' })
  }
  if (!description) {
    return res.status(400).json({ message: 'Ingresa la descripción del plato.', status: 400 })
  }
  if (description.length < 20) {
    return res.status(400).json({ message: 'La descripción del plato debe tener por lo menos 20 caracteres.', status: 400 })
  }
  if (!price) {
    return res.status(400).json({ message: 'Ingresa el precio del plato,', status: 400 })
  }
  if (isNaN(parseFloat(price))) {
    return res.status(400).json({ message: 'El precio no es valido.', status: 400 })
  }
  next();

}