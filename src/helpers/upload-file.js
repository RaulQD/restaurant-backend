import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuid } from 'uuid'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const uploadFile = (files, allowedExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'], folder = '') => {
  return new Promise((resolve, reject) => {
    /* `const nameSplit = file.name.split('.');` is splitting the name of the uploaded file based
        on the dot ('.') character. This operation creates an array where each element is a
        substring of the original file name separated by the dot. This is commonly used to extract
        the file extension from the file name. */
    const { file } = files

    const nameSplit = file.name.split('.')
    /* This line of code is extracting the file extension from the name of the uploaded file. */
    const fileExtension = nameSplit[nameSplit.length - 1]

    if (!allowedExtensions.includes(fileExtension)) {
      return reject(new Error(`La extensión del archivo ${fileExtension} no está permitida. Por favor, usa uno de los permitidos: ${allowedExtensions.join(', ')}`))
    }

    /* The code snippet you provided is generating a unique file name using the `uuid` function from
        the `uuid` package in JavaScript. Here's a breakdown of what the code is doing: */
    const fileName = uuid() + '.' + fileExtension
    const uploadPath = path.join(__dirname, '../../uploads/', folder, fileName)

    /* The code `file.mv(uploadPath, (err) => { ... })` is responsible for moving the uploaded file
        to a specified path on the server. Here's a breakdown of what it does: */
    file.mv(uploadPath, (err) => {
      if (err) {
        return reject(err)
      }
      resolve(fileName)
    })
  })
}
