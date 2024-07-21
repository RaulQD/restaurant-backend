export const validatefiles = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.image_url) {
    return res.status(400).json({ message: 'No se cargo ningun Archivo.' })
  }
  // Obtiene el archivo
  const file = req.files.image_url

  // Lista de extensiones permitidas
  const allowedExtensions = ['png', 'jpg', 'jpge', 'webp']
  const fileExtension = file.name.split('.')
  const extensions = fileExtension[fileExtension.length - 1]
  // Verifica si la extensión es permitida
  if (!allowedExtensions.includes(extensions)) {
    return res.status(400).json({ message: 'Tipo de archivo no permitido. Solo se permiten imágenes PNG, JPG, JPEG y WEBP.' })
  }
  next()
}
