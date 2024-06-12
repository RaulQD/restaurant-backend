import express from "express";
import morgan from "morgan";
import fileUpload from "express-fileupload";

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dishesRoutes from "./routes/dishes.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import uploadsRoutes from "./routes/uploads.routes.js";


const server = express();

server.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true
}));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(morgan("dev"))

server.use('/api/users', userRoutes)
server.use('/api/auth', authRoutes)
server.use('/api/dishes', dishesRoutes)
server.use('/api/category', categoryRoutes)
server.use('/api', uploadsRoutes)

export default server;