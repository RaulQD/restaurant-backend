import express from "express";
import morgan from "morgan";
import dishesRoutes from "./routes/dishes.routes.js";

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(morgan("dev"))

server.use('/api/dishes', dishesRoutes)

export default server;