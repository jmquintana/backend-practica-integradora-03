import { cartsRepository } from "../repositories/carts.repository.js";
import { productsRepository } from "../repositories/products.repository.js";
import { ticketsService } from "./tickets.service.js";

class CartsService {
	constructor() {}

	getCarts = async () => {
		const carts = await cartsRepository.getCarts();
		return carts;
	};

	addCart = async (cart) => {
		const result = await cartsRepository.addCart(cart);
		return result;
	};

	getCartById = async (cartId) => {
		const cart = await cartsRepository.getCartById(cartId);

		if (!cart) return console.log("Cart not found");

		const { products } = cart;

		if (!products) return console.log("Products not found");

		const cartIsEmpty = !cart.products?.length;

		// Calculate sub total price of each product
		products.forEach((product) => {
			product.subTotal = product.product?.price * product.quantity || 0;
		});
		// Calculate total price of all products
		const totalPrice = products.reduce((acc, product) => {
			return acc + parseFloat(product.subTotal);
		}, 0);

		const result = { cart, cartId, cartIsEmpty, products, totalPrice };

		return result;
	};

	addProductToCart = async (productId, cartId, quantity = 1) => {
		const result = await cartsRepository.addProductToCart(
			productId,
			cartId,
			quantity
		);
		return result;
	};

	updateCart = async (cartId, products) => {
		const result = await cartsRepository.updateCart(cartId, products);
		return result;
	};

	editProductQuantity = async (productId, cartId, quantity) => {
		const result = await cartsRepository.editProductInCart(
			productId,
			cartId,
			quantity
		);
		return result;
	};

	deleteCart = async (cartId) => {
		const result = await cartsRepository.deleteCart(cartId);
		return result;
	};

	deleteProductFromCart = async (productId, cartId) => {
		const result = await cartsRepository.deleteProductFromCart(
			productId,
			cartId
		);
		return result;
	};

	getCartCount = async (cartId) => {
		const cart = await cartsRepository.getCartById(cartId);
		return cart?.products?.length || 0;
	};

	deleteAllProductsFromCart = async (productId, cartId) => {
		const result = await cartsRepository.deleteAllProductsFromCart(
			productId,
			cartId
		);
		return result;
	};
}

export const cartsService = new CartsService();
