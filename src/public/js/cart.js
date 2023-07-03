console.log("loaded cart.js");

const incrementBtn = document.querySelectorAll(".increment-btn");
const decrementBtn = document.querySelectorAll(".decrement-btn");
const cartDeleteBtn = document.querySelectorAll(".cart-delete-btn");
const cartQuantity = document.querySelectorAll(".cart-quantity");
const cartTotal = document.querySelector(".cart-total-price-value");
const cartId = document.querySelector(".list-container").id;
const removeProductsBtn = document.querySelectorAll(".remove-products-btn");
const divPurchaseButtons = document.querySelector(".purchase-buttons");
const purchaseBtn = document.querySelector(".purchase-btn");
const logOutBtn = document.querySelector(".profile-logout");

// Add product to cart
incrementBtn.forEach((btn) => {
	btn.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		console.log(e.target);
		const { productId, newQuantity } = getProductValues(e, 1);
		addProductToCart(productId, cartId, newQuantity);
	});
});

// Delete product from cart
decrementBtn.forEach((btn) => {
	btn.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		const { productId, newQuantity } = getProductValues(e, -1);
		deleteProductFromCart(productId, cartId, newQuantity);
	});
});

// Update cart quantity
const addProductToCart = async (productId, cartId, newQuantity) => {
	try {
		updateQuantityLabel(productId, newQuantity);
		updateProductTotal(productId);
		updateCartTotal();
		fetch(`/api/carts/${cartId}/product/${productId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				return handleAddResponse(data);
			});
	} catch (error) {
		console.error(error);
	}
};

// Delete product from cart
const deleteProductFromCart = async (productId, cartId, newQuantity) => {
	if (newQuantity) {
		updateQuantityLabel(productId, newQuantity);
		updateProductTotal(productId);
	} else {
		document.getElementById(productId).remove();
		checkIfThereAreProducts();
	}
	updateCartTotal();
	try {
		fetch(`/api/carts/${cartId}/product/${productId}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				return handleDeleteResponse(data);
			});
	} catch (error) {
		console.error(error);
	}
};

// format numbers with locale AR ES
const formatNumber = (number) => {
	return new Intl.NumberFormat("es-AR").format(number);
};

const getProductValues = (e, diff) => {
	e.stopPropagation();
	e.preventDefault();
	const btnElement =
		e.target.parentNode.parentNode.querySelector(".circle-btn");
	const productElement = btnElement.parentNode.parentNode.parentNode.parentNode;
	const productId = productElement.id;
	const productQuantityElement = productElement.querySelector(
		".product-card-quantity-value"
	).innerText;
	const newQuantity = parseInt(productQuantityElement) + diff;
	return { productId, newQuantity };
};

const updateQuantityLabel = (productId, quantity) => {
	if (quantity === 0) {
		document.getElementById(productId).remove();
		// window.location.reload();
	}
	const productElement = document.getElementById(productId);
	const productQuantityElement = productElement.querySelector(
		".product-card-quantity-value"
	);
	productQuantityElement.innerText = formatNumber(quantity);
};

// update product sub-total
const updateProductTotal = (productId) => {
	const productElement = document.getElementById(productId);
	const productPriceElement = productElement.querySelector(
		".product-card-price-value"
	).innerText;
	const productQuantityElement = productElement.querySelector(
		".product-card-quantity-value"
	).innerText;
	const productTotalElement = productElement.querySelector(
		".product-card-total-value"
	);
	productTotalElement.innerText = formatNumber(
		productPriceElement * productQuantityElement
	);
};

// Update cart total
const updateCartTotal = () => {
	let total = 0;
	const cartSubTotals = document.querySelectorAll(".product-card-total-value");
	cartSubTotals.forEach((subTotalElement) => {
		const subTotal = subTotalElement.innerText.replace(/\./g, "");
		total += parseInt(subTotal);
	});
	cartTotal.innerText = formatNumber(total);
};

//remove all products of the same type from cart
removeProductsBtn.forEach((btn) => {
	btn.addEventListener("click", (e) => {
		e.stopPropagation();
		e.preventDefault();
		const cardElement = e.target.parentNode.parentNode.parentNode.querySelector(
			".remove-products-btn"
		).parentNode.parentNode.parentNode.parentNode;
		const productId = cardElement.id;
		try {
			fetch(`/api/carts/${cartId}/allProducts/${productId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((data) => {
					document.getElementById(productId).remove();
					checkIfThereAreProducts();
					console.log("Se eliminaron productos");
					return handleDeleteResponse(data);
				});
		} catch (error) {
			console.error(error);
		}
	});
});

// Handle responses from server
const handleAddResponse = (data) => {
	console.log(data);
	if (data.status === "Success") {
		console.log("Success");
		showAlert("Product added to cart", "success");
	} else {
		showAlert("Product not added to cart", "error");
	}
};

const handleDeleteResponse = (data) => {
	if (data.status === "Success") {
		showAlert("Product removed from cart", "success");
	} else {
		showAlert("Product not removed from cart", "error");
	}
};

const checkIfThereAreProducts = () => {
	const products = document.querySelector(".cart-products-container").children;
	if (products.length === 0) {
		const divNoProducts = document.createElement("div");
		divNoProducts.classList.add("no-products");
		divNoProducts.innerText = "El carrito está vacío.";
		divPurchaseButtons.remove();
		document
			.querySelector(".cart-products-container")
			.appendChild(divNoProducts);
		document.querySelector(".cart-total-price-container").style.display =
			"none";
	}
};

const handlePurchase = (e) => {
	e.preventDefault();
	e.stopPropagation();
	try {
		fetch(`/api/carts/${cartId}/purchase`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status === "Success") {
					showAlert("Purchase completed", "success");
					// reload page
					setTimeout(window.location.reload(), 1500);
					// window.location.href = "/products";
				} else {
					showAlert("Purchase not completed", "error");
				}
			});
	} catch (error) {
		console.error(error);
	}
};

logOutBtn.addEventListener("click", async (e) => {
	e.preventDefault();
	const email = logOutBtn.id;
	console.log(email);
	try {
		await fetch("/api/users/logout", {
			method: "POST",
			body: JSON.stringify({ username: email }),
			header: {
				"Content-Type": "application/json",
			},
		}).then((res) => {
			if (res.status === 200) {
				window.location.href = "/login";
			} else {
				const error = new Error(res.error);
				throw error;
			}
		});
	} catch (error) {
		console.error(error);
	}
});

purchaseBtn?.addEventListener("click", handlePurchase);
