import { Router } from "express";
import {
	checkRegistered,
	checkLogin,
	checkSession,
	checkAdmin,
	checkUser,
} from "../middlewares/auth.js";
import {
	renderPaginatedProducts,
	renderProduct,
} from "../controllers/products.controller.js";
import {
	renderCartById,
	editProductQuantity,
	renderCarts,
} from "../controllers/carts.controller.js";

const viewsRouter = Router();

viewsRouter.get("/", checkLogin, renderPaginatedProducts);
viewsRouter.get("/carts", checkAdmin, renderCarts);
viewsRouter.get("/product/:pid", renderProduct);
viewsRouter.put("/:cid", editProductQuantity);
viewsRouter.get("/cart/:cid", checkLogin, renderCartById);
viewsRouter.get("/register", checkRegistered, (req, res) => {
	res.render("register");
});
viewsRouter.get("/login", checkSession, (req, res) => {
	res.render("login");
});
viewsRouter.get("/profile", checkLogin, (req, res) => {
	res.render("profile", { user: req.session.user });
});
viewsRouter.get("/restore", (req, res) => {
	res.render("restore");
});

export default viewsRouter;
