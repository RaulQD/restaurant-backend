import jwt from 'jsonwebtoken'

export const generateJWT = (payload) => {
  // SIGN -> SIRVE PARA CREAR EL JSON WEB TOKEN
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: 86400 // 24 horas
  })
  return token
}
