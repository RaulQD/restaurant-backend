import mongoose from 'mongoose'
import { exit } from 'node:process'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL)
    const url = `${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`
    console.log(`MongoDB Connected: ${url}`)
  } catch (error) {
    console.log(error.message)
    exit(1)
  }
}
