import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

export const uploadImage = async (filePath) => {
  return await cloudinary.uploader.upload(filePath)
}

export const deleteImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId)
}
