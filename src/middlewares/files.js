export const validatefiles = (req, res, next) => {
  // Verifica si se ha cargado un archivo
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.images) {
    const error = new Error('No se cargo ninguna imagen.')
    return res.status(400).json({ error: error.message })
  }
  // Obtiene el archivo
  const file = req.files.images

  // Lista de extensiones permitidas
  const allowedExtensions = ['png', 'jpg', 'jpge', 'webp']
  const fileExtension = file.name.split('.')
  const extensions = fileExtension[fileExtension.length - 1]
  // Verifica si la extensión es permitida
  if (!allowedExtensions.includes(extensions)) {
    const error = new Error('Tipo de archivo no permitido. Solo se permiten imágenes PNG, JPG, JPEG y WEBP.')
    return res.status(400).json({ error: error.message })
  }
  next()
}
