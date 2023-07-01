// import ProductManager from "../managers/ProductManager.js";
import { Router } from "express";
import { uploader } from "../utils.js";
import {
	getProducts,
	getProductById,
	addProduct,
	addManyProducts,
	updateProduct,
	deleteProduct,
	getRandomProducts,
	getRandomProduct,
} from "../controllers/products.controller.js";

const productsRouter = Router();

productsRouter.get("/", getProducts);
// productsRouter.get("/:pid", getProductById);
productsRouter.post("/", uploader.array("thumbnails", 10), addProduct);
productsRouter.post("/many", addManyProducts);
productsRouter.put("/:pid", updateProduct);
productsRouter.delete("/:pid", deleteProduct);
productsRouter.get("/mockingproducts", getRandomProducts);
productsRouter.get("/mockingproduct", getRandomProduct);

export default productsRouter;
