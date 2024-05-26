import express from "express";
import morgan from "morgan";
import dishesRoutes from "./routes/dishes.routes.js";
import categoryRoutes from "./routes/category.routes.js";

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(morgan("dev"))

server.use('/api/dishes', dishesRoutes)
server.use('/api/category', categoryRoutes)

export default server;