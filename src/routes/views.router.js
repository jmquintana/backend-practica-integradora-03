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
import {
	passportCall,
	handlePolicies,
	validateTokenJwt,
} from "../middlewares/authorization.js";

const viewsRouter = Router();

viewsRouter.get("/", passportCall("jwt"), renderPaginatedProducts);

viewsRouter.get(
	"/carts",
	passportCall("jwt"),
	handlePolicies(["admin"]),
	renderCarts
);
viewsRouter.get("/product/:pid", passportCall("jwt"), renderProduct);
viewsRouter.put("/:cid", editProductQuantity);
viewsRouter.get("/cart/:cid", passportCall("jwt"), renderCartById);
viewsRouter.get("/register", checkRegistered, (req, res) => {
	res.render("register");
});
viewsRouter.get("/login", checkSession, (req, res) => {
	res.render("login");
});
viewsRouter.get("/profile", passportCall("jwt"), (req, res) => {
	console.log(req.user);
	res.render("profile", { user: req.user });
});
viewsRouter.get("/restore", (req, res) => {
	res.render("restore");
});
viewsRouter.get("/reset", validateTokenJwt, (req, res) => {
	res.render("reset");
});

export default viewsRouter;
