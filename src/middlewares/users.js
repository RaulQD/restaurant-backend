export const validateInputs = (req, res, next) => {
  const { email, password, firstName, lastName, phone, address } = req.body
  if (!email || email.trim() === '') {
    return res.status(400).json({ message: 'Ingresa un correo electrónico', status: 400 })
  }
  if (!password || password.trim() === '') {
    const error = new Error('Ingresa una contraseña')
    return res.status(400).json({ message: error.message, status: 400 })
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres', status: 400 })
  }
  if (!firstName || firstName.trim() === '') {
    return res.status(400).json({ message: 'Ingresa tu nombre', status: 400 })
  }
  if (!lastName || lastName.trim() === '') {
    return res.status(400).json({ message: 'Ingresa tu apellido', status: 400 })
  }
  if (!phone || phone.trim() === '') {
    return res.status(400).json({ message: 'Ingresa tu número de teléfono', status: 400 })
  }
  if (!address || address.trim() === '') {
    return res.status(400).json({ message: 'Ingresa tu dirección', status: 400 })
  }

  next()
}
