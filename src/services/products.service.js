import { productsRepository } from "../repositories/index.js";

export default class ProductsService {
	constructor() {}

	getProducts = async (limit, page, category, status, sort) => {
		const products = await productsRepository.getProducts(
			limit,
			page,
			category,
			status,
			sort
		);
		return products;
	};

	getPaginatedProducts = async (filters, options) => {
		const result = await productsRepository.getPaginatedProducts(
			filters,
			options
		);
		return result;
	};

	addProduct = async (product, files) => {
		product.thumbnails = [];

		if (files) {
			files.forEach((file) => {
				const imageUrl = `http://localhost:3000/images/${file.filename}`;
				product.thumbnails.push(imageUrl);
			});
		}
		const result = await productsRepository.addProduct(product);
		return result;
	};

	getProductById = async (productId) => {
		const result = await productsRepository.getProductById(productId);
		return result;
	};

	addManyProducts = async (arrOfProducts) => {
		const result = await productsRepository.addManyProducts(arrOfProducts);
		return result;
	};

	updateProduct = async (productId, changes) => {
		const result = await productsRepository.updateProduct(productId, changes);
		return result;
	};

	deleteProduct = async (productId) => {
		const result = await productsRepository.deleteProduct(productId);
		return result;
	};
}

export const productsService = new ProductsService();
