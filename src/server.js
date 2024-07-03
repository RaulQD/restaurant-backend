import express from "express";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dishesRoutes from "./routes/dishes.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import uploadsRoutes from "./routes/uploads.routes.js";


const server = express();

server.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(morgan("dev"))

server.use('/api/v1/users', userRoutes)
server.use('/api/v1/auth', authRoutes)
server.use('/api/v1/dishes', dishesRoutes)
server.use('/api/v1/category', categoryRoutes)
server.use('/api/v1/', uploadsRoutes)

//DOCS
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


export default server;