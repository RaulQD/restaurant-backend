import jwt from 'jsonwebtoken'
import { User } from '../models/Users.js'
import { Role } from '../models/Role.js'

export const validateToken = async (req, res, next) => {
  // OBTIENE EL TOKEN DE LA CABECERA
  const bearer = req.headers.authorization
  if (!bearer) { // SI NO HAY TOKEN RETORNA UN MENSAJE DE ERROR
    const error = new Error('No autorizado')
    return res.status(401).json({ error: error.message })
  }
  // SEPARA EL TOKEN DEL BEARER
  const token = bearer.split(' ')[1]
  try {
    // VERIFY -> SIRVE PARA VERIFICAR SI EL TOKEN ES VALIDO
    // PASA 2 ARGUMENTOS EL TOKEN Y LA SECRET KEY
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    const user = await User.findById(decoded.id) // BUSCA EL USUARIO POR EL ID
    if (user) { // SI EL USUARIO EXISTE LO GUARDA EN req.user
      req.user = user
    } else { // SI NO EXISTE RETORNA UN MENSAJE DE ERROR
      res.status(401).json({ message: 'Usuario no encontrado' })
    }
  } catch (error) {
    // CASOS DE ERRORES MAS COMUNES
    // 1. TOKEN EXPIRADO
    // 2. TOKEN INVALIDO
    // 3. TOKEN NO ENVIADO
    console.log('error', error)
    return res.status(500).json({ message: 'Token no valido' })
  }
  next()
}

export const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user._id)
  const roles = await Role.find({ _id: { $in: user.roles } })
  // VALIDAR SI EL USUARIO TIENE EL ROL DE ADMIN
  const isAdmin = roles.find(role => role.name === 'ADMIN_ROLE')
  if (!isAdmin) {
    const error = new Error('No tienes los permisos necesarios')
    return res.status(401).json({ error: error.message })
  }
  next()
}

export const isEmployee = async (req, res, next) => {
  const user = await User.findById(req.user._id)
  const roles = await Role.find({ _id: { $in: user.roles } })
  const isEmployee = roles.find(role => role.name === 'EMPLOYEE_ROLE')

  if (!isEmployee) {
    const error = new Error('No tienes los permisos necesarios')
    return res.status(401).json({ error: error.message })
  }
  next()
}
