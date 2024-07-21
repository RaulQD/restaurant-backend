import { request, response } from 'express'

export const validateParams = (req = request, res = response, next) => {
  const { type } = req.params
  // VALIDAR QUE EXISTA EL TIPO EN LOS PARAMETROS
  const types = ['dishes', 'users']
  const existType = types.includes(type)
  if (!existType) {
    return res.status(400).json({ msg: `El tipo ${type} no esta permitido. Porfavor usa uno de los permitidos ${types}` })
  }

  next()
}
