export const validateInputs = (req, res, next) => {
  const { email, password, firstName, lastName, dni, phone } = req.body
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

// VALIDAR LOS CAMPOS DE LA DIRECCIÓN
export const validateAddress = (req, res, next) => {
  const { street, number, provinces, department, district } = req.body

  if (!street || street.trim() === '') {
    const error = new Error('La calle es requerida')
    return res.status(400).json({ error: error.message, status: false })
  }
  if (street.length < 10) {
    const error = new Error('La calle debe tener al menos 10 caracteres')
    return res.status(400).json({ error: error.message, status: false })
  }
  if (!number || number.trim() === '') {
    const error = new Error('El número es requerido')
    return res.status(400).json({ error: error.message, status: false })
  }
  if (!provinces || provinces.trim() === '') {
    const error = new Error('La provincia es requerida')
    return res.status(400).json({ error: error.message, status: false })
  }
  if (!department || department.trim() === '') {
    const error = new Error('El departamento es requerido')
    return res.status(400).json({ error: error.message, status: false })
  }
  if (!district || district.trim() === '') {
    const error = new Error('El distrito es requerido')
    return res.status(400).json({ error: error.message, status: false })
  }
  next()
}
