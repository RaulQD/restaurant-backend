export const validateInputs = (req, res, next) => {
  const { email, password, firstName, lastName, dni, phone, address } = req.body
  if (!email || email.trim() === '') {
    const error = new Error('Ingresa un correo electrónico')
    return res.status(400).json({ error: error.message, status: false })
  }
  if (!password || password.trim() === '') {
    const error = new Error('Ingresa una contraseña')
    return res.status(400).json({ error: error.message, status: false })
  }
  if (password.length < 8) {
    const error = new Error('La contraseña debe tener al menos 8 caracteres')
    return res.status(400).json({ error: error.message, status: false })
  }
  if (!firstName || firstName.trim() === '') {
    const error = new Error('Ingresa tu nombre')
    return res.status(400).json({ error: error.message, status: false })
  }
  if (!lastName || lastName.trim() === '') {
    const error = new Error('Ingresa un correo electrónico')
    return res.status(400).json({ error: 'Ingresa tu apellido', status: false })
  }
  if (!dni || dni.trim() === '') {
    const error = new Error('Ingresa tu número de documento')
    return res.status(400).json({ error: error.message, status: false })
  }
  if (!phone || phone.trim() === '') {
    const error = new Error('Ingresa tu número de teléfono')
    return res.status(400).json({ error: error.message, status: false })
  }
  if (!address || address.trim() === '') {
    const error = new Error('Ingresa tu dirección')
    return res.status(400).json({ error: error.message, status: false })
  }
  next()
}

// VALIDAR SI EL PASSWORD ES EL MISMO QUE EL DE CONFIRMACION
export const validatePassword = (req, res, next) => {
  const { password, confirmPassword } = req.body

  if (!password || !confirmPassword) {
    const error = new Error('Ambas contraseñas son requeridas')
    return res.status(400).json({ error: error.message, status: false })
  }
  if (password !== confirmPassword) {
    const error = new Error('Las contraseñas no coinciden')
    return res.status(400).json({ error: error.message, status: false })
  }
  if (!password) {
    const error = new Error('La contraseña es requerida')
    return res.status(400).json({ error: error.message, status: false })
  }
  next()
}
