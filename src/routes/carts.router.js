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
import { passportCall, handlePolicies } from "../middlewares/authorization.js";

const cartsRouter = Router();

cartsRouter.post("/", addCart);
cartsRouter.get("/", passportCall("jwt"), handlePolicies(["admin"]), getCarts);
cartsRouter.get("/:cid", checkSession, getCartById);
cartsRouter.post(
	"/:cid/product/:pid",
	passportCall("jwt"),
	handlePolicies(["user"]),
	addProductToCart
);
cartsRouter.put(
	"/:cid",
	passportCall("jwt"),
	handlePolicies(["user"]),
	updateCart
);
cartsRouter.delete(
	"/:cid/product/:pid",
	passportCall("jwt"),
	handlePolicies(["user"]),
	deleteProductFromCart
);
cartsRouter.delete(
	"/:cid/allProducts/:pid",
	passportCall("jwt"),
	handlePolicies(["user"]),
	deleteAllProductFromCart
);
cartsRouter.delete("/:cid", passportCall("jwt"), deleteCart);
cartsRouter.post(
	"/:cid/purchase",
	passportCall("jwt"),
	handlePolicies(["user"]),
	handlePurchase
);

export default cartsRouter;
