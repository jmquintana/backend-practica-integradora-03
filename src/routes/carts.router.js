import { Router } from "express";
import {
	addCart,
	getCarts,
	getCartById,
	addProductToCart,
	updateCart,
	deleteProductFromCart,
	deleteAllProductFromCart,
	deleteCart,
	handlePurchase,
} from "../controllers/carts.controller.js";
import { checkAdmin, checkUser, checkSession } from "../middlewares/auth.js";
import { passportCall } from "../middlewares/authorization.js";

const cartsRouter = Router();

cartsRouter.post("/", addCart);
cartsRouter.get("/", passportCall("jwt"), checkAdmin, getCarts);
cartsRouter.get("/:cid", checkSession, getCartById);
cartsRouter.post(
	"/:cid/product/:pid",
	passportCall("jwt"),
	checkUser,
	addProductToCart
);
cartsRouter.put("/:cid", passportCall("jwt"), checkUser, updateCart);
cartsRouter.delete(
	"/:cid/product/:pid",
	passportCall("jwt"),
	checkUser,
	deleteProductFromCart
);
cartsRouter.delete(
	"/:cid/allProducts/:pid",
	passportCall("jwt"),
	checkUser,
	deleteAllProductFromCart
);
cartsRouter.delete("/:cid", passportCall("jwt"), deleteCart);
cartsRouter.post(
	"/:cid/purchase",
	passportCall("jwt"),
	checkUser,
	handlePurchase
);

export default cartsRouter;
