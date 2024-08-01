export const validateFieldsClient = (req, res, next) => {
  const { name, lastName, password, email, dni, phone } = req.body

  // Validar que el nombre no este vacio
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ message: ' Ingresa un nombre ', status: 400 })
  }
  // Validar que el apellido no este vacio
  if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
    return res.status(400).json({ message: ' Ingresa un apellido ', status: 400 })
  }
  // Validar que el DNI sea un numero de 8 digitos
  const regexDni = /^[0-9]{8}$/
  if (!dni || dni.trim() === '' || !regexDni.test(dni)) {
    return res.status(400).json({ message: ' Ingresa tu DNI correctamente ', status: 400 })
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

  next()
}
