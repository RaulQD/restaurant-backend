import jwt from 'jsonwebtoken'

export const generateTokenPasswordReset = (payload) => {
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '10m' // EXPIRA EN 10 MINUTOS
  })
  return token
}
