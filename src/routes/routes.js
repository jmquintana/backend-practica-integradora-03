import { Router } from "express";
import productsRouter from "./products.router.js";
import cartsRouter from "./carts.router.js";
import sessionsRouter from "./sessions.router.js";
import viewsRouter from "./views.router.js";

const routerAPI = (app) => {
	const router = Router();
	app.use("/api", router);
	app.use("/", viewsRouter);

	router.use("/products", productsRouter);
	router.use("/carts", cartsRouter);
	router.use("/sessions", sessionsRouter);
};

export default routerAPI;
