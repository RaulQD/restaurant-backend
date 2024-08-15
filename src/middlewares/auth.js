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

/**
 * The function `checkRole` checks if a user has a specific role before allowing access to a route.
 * @param requireRole - The `requireRole` parameter in the `checkRole` function is the role that is
 * required to access a specific route or perform a certain action. This function is designed to check
 * if the authenticated user has the required role in order to proceed with the request. If the user
 * does not have the required
 * @returns The `checkRole` function returns a middleware function that checks if the authenticated
 * user has a specific role required to access a certain route. If the user has the required role, the
 * middleware calls the `next()` function to proceed to the next middleware or route handler. If the
 * user does not have the required role, it returns a 401 status with an error message indicating the
 * missing role. If there
 */
export const checkRole = (requireRole) => async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    const roles = await Role.find({ _id: { $in: user.roles } })
    const hasRole = roles.some(role => role.name === requireRole)
    if (!hasRole) {
      const error = new Error(`No tiene los permisos necesarios, se requiere el rol de ${requireRole}`)
      return res.status(401).json({ error: error.message })
    }
    next()
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}
export const isAdmin = checkRole('ADMIN_ROLE')
export const isUser = checkRole('USER_ROLE')
export const isEmployee = checkRole('EMPLOYEE_ROLE')

// export const isAdmin = async (req, res, next) => {
//   const user = await User.findById(req.user._id)
//   const roles = await Role.find({ _id: { $in: user.roles } })
//   // VALIDAR SI EL USUARIO TIENE EL ROL DE ADMIN
//   const isAdmin = roles.find(role => role.name === 'ADMIN_ROLE')
//   if (!isAdmin) {
//     const error = new Error('No tienes los permisos necesarios')
//     return res.status(401).json({ error: error.message })
//   }
//   next()
// }

// export const isEmployee = async (req, res, next) => {
//   const user = await User.findById(req.user._id)
//   const roles = await Role.find({ _id: { $in: user.roles } })
//   const isEmployee = roles.find(role => role.name === 'EMPLOYEE_ROLE')

//   if (!isEmployee) {
//     const error = new Error('No tienes los permisos necesarios')
//     return res.status(401).json({ error: error.message })
//   }
//   next()
// }
