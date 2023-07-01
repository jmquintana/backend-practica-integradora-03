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

const cartsRouter = Router();

cartsRouter.post("/", addCart);
cartsRouter.get("/", checkAdmin, getCarts);
cartsRouter.get("/:cid", checkSession, getCartById);
cartsRouter.post("/:cid/product/:pid", checkUser, addProductToCart);
cartsRouter.put("/:cid", checkUser, updateCart);
cartsRouter.delete("/:cid/product/:pid", checkUser, deleteProductFromCart);
cartsRouter.delete(
	"/:cid/allProducts/:pid",
	checkUser,
	deleteAllProductFromCart
);
cartsRouter.delete("/:cid", deleteCart);
cartsRouter.post("/:cid/purchase", checkUser, handlePurchase);

export default cartsRouter;
