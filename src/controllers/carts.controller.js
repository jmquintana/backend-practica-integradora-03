import { cartsService, ticketsService } from "../services/index.js";
import { success, error, validation } from "../api.responser.js";

export async function renderCartById(req, res) {
	try {
		const cartId = req.params.cid;
		const user = req.user;
		const result = await cartsService.getCartById(cartId);
		result.user = user;
		return res.render("cart", result);
	} catch (error) {
		return res.send({
			status: "Error",
			error: "Something went wrong while rendering cart",
		});
	}
}

export async function renderCarts(req, res) {
	try {
		const result = {};
		const user = req.user;
		result.carts = await cartsService.getCarts();
		result.user = user;
		return res.render("carts", result);
	} catch (error) {
		return res.send({
			status: "Error",
			error: "Something went wrong while rendering carts",
		});
	}
}

export async function editProductQuantity(req, res) {
	try {
		const cartId = req.params.cid;
		const productId = req.body.productId;
		const newQuantity = req.body.newQuantity;
		const result = await cartsService.editProductQuantity(
			cartId,
			productId,
			newQuantity
		);
		// return res.send({ status: "Success", result });
		return res.send({
			status: "Success",
			result,
		});
	} catch (err) {
		return res.send({
			status: "Error",
			error: "Something went wrong while editing product quantity",
		});
	}
}

export async function addCart(req, res) {
	const result = await cartsService.addCart();
	return res.send({ status: "Success", result });
}

export async function getCarts(req, res) {
	const result = await cartsService.getCarts();
	return res.send({ status: "Success", result });
}

export async function getCartById(req, res) {
	const cartId = req.params.cid;
	const result = await cartsService.getCartById(cartId);
	return res.send({ status: "Success", result });
}

export async function addProductToCart(req, res) {
	const cartId = req.params.cid;
	const productId = req.params.pid;
	const result = await cartsService.addProductToCart(productId, cartId);
	return res.send({ status: "Success", result });
}

export async function updateCart(req, res) {
	const cartId = req.params.cid;
	const products = req.body.products;
	const result = await cartsManager.updateCart(cartId, products);
	return res.send({ status: "Success", result });
}

export async function deleteProductFromCart(req, res) {
	const cartId = req.params.cid;
	const productId = req.params.pid;
	const result = await cartsService.deleteProductFromCart(productId, cartId);
	return res.send({ status: "Success", result });
}

export async function deleteAllProductFromCart(req, res) {
	const cartId = req.params.cid;
	const productId = req.params.pid;
	const result = await cartsService.deleteAllProductsFromCart(
		productId,
		cartId
	);
	return res.send({ status: "Success", result });
}

export async function deleteCart(req, res) {
	const cartId = req.params.cid;
	const result = await cartsService.deleteCart(cartId);
	return res.send({ status: "Success", result });
}

export async function handlePurchase(req, res) {
	const cartId = req.params.cid;
	const userId = req.user.email;
	const result = await ticketsService.handlePurchase(cartId, userId);
	return res.send(result);
}
