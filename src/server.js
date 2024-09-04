import express from 'express'
import morgan from 'morgan'
import { connectDB } from './config/mongoDB.js'
import dotenv from 'dotenv'
import cors from 'cors'
import { corsConfig } from './config/cors.js'
import fileUpload from 'express-fileupload'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger.js'

import userRoutes from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'
import dishesRoutes from './routes/dishes.routes.js'
import categoryRoutes from './routes/category.routes.js'
import uploadRoutes from './routes/uploads.routes.js'
import addressRoutes from './routes/address.routes.js'
import cartRoutes from './routes/cart.routes.js'

dotenv.config()
connectDB()

const server = express()

server.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './uploads'
}))
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(morgan('dev'))
server.use(cors(corsConfig))

server.use('/api/v1/user', userRoutes)
server.use('/api/v1/auth', authRoutes)
server.use('/api/v1/dishes', dishesRoutes)
server.use('/api/v1/category', categoryRoutes)
server.use('/api/v1/uploads', uploadRoutes)
server.use('/api/v1/address', addressRoutes)
server.use('/api/v1/cart', cartRoutes)

// DOCS
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default server
