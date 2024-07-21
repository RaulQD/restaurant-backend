export const validateFields = (req, res, next) => {
  const { first_name, last_name, password, email, dni, phone, position, salary, roles } = req.body

  // Validar que el nombre no este vacio
  if (!first_name || typeof first_name !== 'string' || first_name.trim() === '') {
    return res.status(400).json({ message: ' Ingresa un nombre ', status: 400 })
  }
  // Validar que el apellido no este vacio
  if (!last_name || typeof last_name !== 'string' || last_name.trim() === '') {
    return res.status(400).json({ message: ' Ingresa un apellido ', status: 400 })
  }
  // Validar que el DNI sea un numero de 8 digitos
  const regexDni = /^[0-9]{8}$/
  if (!dni || dni.trim() === '' || !regexDni.test(dni)) {
    return res.status(400).json({ message: ' Ingresa tu DNI correctamente', status: 400 })
  }
  // Validar que el email sea un correo electronico
  const regexEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
  if (!email || email.trim() === '' || !regexEmail.test(email)) {
    return res.status(400).json({ message: ' Ingresa un correo electronico valido ', status: 400 })
  }
  // Validar que la contraseña sea mayor a 8 caracteres
  const regexPassword = /^.{8,15}$/
  if (!password || password.trim() === '' || !regexPassword.test(password)) {
    return res.status(400).json({ message: ' Ingresa una contraseña valida con almenos 8 a 15 caracteres ', status: 400 })
  }
  // Validar que el telefono sea un numero de 9 digitos
  const regexPhone = /^9[0-9]{8}$/
  if (!phone || phone.trim() === '' || !regexPhone.test(phone)) {
    return res.status(400).json({ message: 'Ingresa un número de teléfono válido (9 dígitos) ', status: 400 })
  }
  // Validar que LA posición no este vacio
  if (!position || typeof position !== 'string' || position.trim() === '') {
    return res.status(400).json({ message: ' Ingresa un cargo', status: 400 })
  }
  // Validar que el salario sea un numero mayor a 0
  if (!salary || typeof salary !== 'number' || salary < 0) {
    return res.status(400).json({ message: ' Ingresa un salario valido', status: 400 })
  }

  if (!roles || !Array.isArray(roles) || roles.length === 0) {
    return res.status(400).json({ message: ' Seleccione un rol', status: 400 })
  }
  next()
}
