import { productsService } from "../services/products.service.js";
import { cartsService } from "../services/carts.service.js";
import { generateProduct } from "../utils.js";

import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateProductErrorInfo } from "../services/errors/info.js";

// export async function getProducts(req, res) {
// 	const { limit, page, category, status, sort } = req.query;
// 	const products = productsService.getProducts(
// 		limit,
// 		page,
// 		category,
// 		status,
// 		sort
// 	);

// 	return res.send({ status: "Success", payload: products });
// }

export async function getProducts(req, res) {
	let { user } = req.session;
	const { limit, page, category, status, sort } = req.query;
	const filters = {};
	const options = {
		limit: parseInt(limit) || 100,
		page: parseInt(page) || 1,
		lean: true,
	};

	user.isAdmin = user?.role === "admin";

	if (user.cart)
		user.cartCount = await cartsService.getCartCount(user.cart._id);

	if (category) {
		filters.category = category;
	}

	if (status) {
		filters.status = status;
	}

	if (sort) {
		options.sort = sort;
	}

	const {
		docs: products,
		hasPrevPage,
		hasNextPage,
		prevPage,
		nextPage,
		totalDocs,
		totalPages,
	} = await productsService.getPaginatedProducts(filters, options);

	return res.send({
		status: "Success",
		payload: {
			products,
			page,
			hasPrevPage,
			hasNextPage,
			prevPage,
			nextPage,
			totalDocs,
			totalPages,
			user,
		},
	});
}

export async function renderPaginatedProducts(req, res) {
	let { user } = req.session;
	const { limit, page, category, status, sort } = req.query;
	const filters = {};
	const options = {
		limit: parseInt(limit) || 5,
		page: parseInt(page) || 1,
		lean: true,
	};

	user.isAdmin = user?.role === "admin";

	if (user.cart)
		user.cartCount = await cartsService.getCartCount(user.cart._id);

	if (category) {
		filters.category = category;
	}

	if (status) {
		filters.status = status;
	}

	if (sort) {
		options.sort = sort;
	}

	const {
		docs: products,
		hasPrevPage,
		hasNextPage,
		prevPage,
		nextPage,
		totalDocs,
		totalPages,
	} = await productsService.getPaginatedProducts(filters, options);

	return res.render("products", {
		products,
		page,
		hasPrevPage,
		hasNextPage,
		prevPage,
		nextPage,
		totalDocs,
		totalPages,
		user,
	});
}

export async function getProductById(req, res) {
	const productId = req.params.pid;
	const product = await productsService.getProductById(productId);
	return res.send({ status: "Success", payload: product });
}

export async function renderProduct(req, res) {
	const result = {};
	const productId = req.params.pid;
	const cartId = req.session.user?.cart?._id || "";
	result.cartId = cartId;
	const user = req.session.user || "guest";
	result.user = user;
	const product = await productsService.getProductById(productId);
	result.product = product;
	res.render("product", result);
}

export async function addProduct(req, res) {
	const product = req.body;
	const files = req.files.splice(0, 4);

	if (!product) {
		CustomError.createError({
			name: EErrors.MISSING_INFORMATION,
			cause: "Error, the product could no be added, missing information",
			code: 1,
		});
		// return res.status(400).send({
		// 	status: "Error",
		// 	error: "Error, the product could no be added",
		// });
	}

	const result = await productsService.addProduct(product, files);
	const response = {
		ok: true,
		status: "Added",
		message: "Product added",
		result,
	};
	return res.send(response);
}

export async function addManyProducts(req, res) {
	const products = req.body;
	const arrOfProducts = products.slice(0, 100);
	const result = await productsService.addManyProducts(arrOfProducts);

	return res.send({ status: "Success", payload: result });
}

export async function updateProduct(req, res) {
	const productId = req.params.pid;
	const changes = req.body;
	if (!changes) {
		return res
			.status(400)
			.send({ status: "Error", error: "missing information" });
	}
	const result = productsService.updateProduct(productId, changes);

	return res.send({ status: "Success", payload: result });
}

export async function deleteProduct(req, res) {
	const productId = req.params.pid;
	const result = await productsService.deleteProduct(productId);

	return res.send({ status: "Success", payload: result });
}

export async function getRandomProducts(req, res) {
	let products = [];
	for (let i = 0; i < 100; i++) {
		products.push(generateProduct());
	}
	res.json({ status: "Success", payload: products });
}

export async function getRandomProduct(req, res) {
	const product = generateProduct();
	res.json({ status: "Success", payload: product });
}
