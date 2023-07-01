console.log("loaded products.js");

const cartId = document.querySelector(".profile-cart")?.id;
const forms = document.querySelectorAll(".add-form");
const products = document.querySelectorAll(".product-item-full");
const logOutBtn = document.querySelector(".profile-logout");
const cartBadge = document.querySelector(".cart-badge");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".open-modal-btn");
const deleteButtons = document.querySelectorAll(".delete-btn");
const addButtons = document.querySelectorAll(".add-btn");
const addProductBtn = document.querySelector(".submit");
const form = document.querySelector(".form");

forms.forEach((form) => {
	form.addEventListener("click", (e) => {
		e.preventDefault();
		const productId = e.target.closest(".add-form").id;
		try {
			cartBadge.classList.remove("hidden");
			cartBadge.innerText = parseInt(cartBadge.innerText) + 1;
			animateCSS("#lblCartCount1", "flipInY");
			animateCSS("#lblCartCount2", "flipInY");
			fetch(`/api/carts/${cartId}/product/${productId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					showAlert("Product added to cart", "success");
				})
				.catch((err) => {
					console.log(err);
					// showAlert("Product not added to cart", "error");
				});
		} catch (error) {
			console.log(error);
		}
	});
});

products.forEach((product) => {
	product.addEventListener("click", (e) => {
		e.preventDefault();
		const target = e.target;
		const classList = target.classList;
		if (classList.contains("add-btn") || classList.contains("delete-btn"))
			return;
		const productId = target.id.slice(4);
		if (!productId) return;
		try {
			window.location.href = `/product/${productId}`;
		} catch (error) {
			console.log(error);
		}
	});
});

logOutBtn.addEventListener("click", async (e) => {
	e.preventDefault();
	const email = logOutBtn.id;
	console.log(email);
	try {
		await fetch("/api/sessions/logout", {
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

const getRandProduct = new Promise((resolve, reject) => {
	fetch("/api/products/mockingproduct")
		.then((res) => res.json())
		.then((data) => {
			resolve(data.payload);
		})
		.catch((err) => {
			reject(err);
		});
});

const getRandomProduct = async () => {
	return await fetch("/api/products/mockingproduct")
		.then((res) => res.json())
		.then((data) => data.payload)
		.catch((err) => console.log(err));
};

const openModal = async () => {
	form.classList.remove("hidden");
	modal.classList.remove("hidden");
	overlay.classList.remove("hidden");
	form.classList.remove("transparent");
	modal.classList.remove("transparent");
	overlay.classList.remove("transparent");
	form.classList.remove("animate__fadeOutUp");
	modal.classList.remove("animate__fadeOut");
	overlay.classList.remove("animate__fadeOut");
	form.classList.add("animate__fadeInDown");
	modal.classList.add("animate__fadeIn");
	overlay.classList.add("animate__fadeIn");
	getRandProduct.then((product) => populateForm(form, product));
	addProductBtn.focus();
};

const closeModal = () => {
	form.classList.add("transparent");
	modal.classList.add("transparent");
	overlay.classList.add("transparent");
	form.classList.add("animate__fadeOutUp");
	modal.classList.add("animate__fadeOut");
	overlay.classList.add("animate__fadeOut");
	form.classList.remove("animate__fadeInDown");
	modal.classList.remove("animate__fadeIn");
	overlay.classList.remove("animate__fadeIn");
};

overlay.addEventListener("click", closeModal);
addProductBtn.addEventListener("click", closeModal);
openModalBtn?.addEventListener("click", openModal);

const random = (max) => {
	return Math.floor(Math.random() * max);
};

const handleAdd = (e) => {
	e.preventDefault();
	e.stopPropagation();
	const myFormData = new FormData(e.target);
	fetch("/api/products", {
		method: "POST",
		body: myFormData,
	})
		.then((resp) => resp.json())
		.then((data) => {
			if (data.ok) {
				showAlert(data.message, "success");
			} else {
				showAlert(data.message, "error");
			}
		});
};

const handleDelete = (e) => {
	e.preventDefault();
	e.stopPropagation();
	const productId = e.target.parentNode.id;
	fetch(`/api/products/${productId}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	}).then(() => {
		showAlert("Product deleted", "success");
		window.location.href = "/";
	});
};

form.addEventListener("submit", handleAdd);

deleteButtons.forEach((element) => {
	element.addEventListener("click", handleDelete);
});

const addProductElement = (data) => {
	console.log(data);
	if (data.ok) {
		const product = data?.result;
		const groupListElement = document.querySelector(".product-list");
		const listElement = document.createElement("div");
		let htmlContent = `
			<div class="product-item-text">
				<div class="first row">
					<div class="item-title">
						${product.title}
					</div>
					<div class="item-code">
						Código:
						${product.code}
					</div>
				</div>
				<div class="second row">
					<div class="item-description">
						${product.description}
					</div>
				</div>
				<div class="third row">
					<div class="item-price">
						$
						${product.price}
					</div>
					<div class="item-stock">
						Stock:
						${product.stock}
						unidades
					</div>
				</div>
			</div>
			<div class="item-thumbnails">`;
		const images = product.thumbnails;
		if (images.length > 0) {
			product.thumbnails.forEach((thumbnail) => {
				htmlContent += `<div class="item-thumbnail"><img src="${thumbnail}" alt="" /></div>`;
			});
		} else {
			htmlContent += `<div class="no-image">Sin imágenes</div>`;
		}
		htmlContent += `</div><div class="delete-btn btn">Borrar</div>`;
		listElement.innerHTML = htmlContent;
		listElement.id = product._id;
		listElement.classList.add("product-item-full");
		groupListElement.appendChild(listElement);
		const deleteButtons = document.querySelectorAll(".delete-btn");
		deleteButtons[deleteButtons.length - 1].addEventListener(
			"click",
			handleDelete
		);
		const noProductsNode = document.querySelectorAll(".no-products");
		noProductsNode.forEach((node) => node.remove());

		showAlert("Product added", "success");
	} else {
		showAlert("Product not added", "error");
	}
};

const deleteProductElement = (product) => {
	const liToRemove = document.getElementById(product._id);
	const parentNode = liToRemove.parentNode;
	liToRemove.remove();
	const liElements = document.querySelectorAll(".product-list > div");
	if (!liElements.length) {
		const noProductsNode = document.createElement("div");
		noProductsNode.innerHTML = `No products loaded`;
		noProductsNode.classList.add("no-products");
		parentNode.appendChild(noProductsNode);
	}
	showAlert("Product deleted", "success");
};

const populateForm = async (form, product) => {
	const formElements = [...form.elements];
	formElements.forEach((element) => {
		const id = element.id;

		if (element.id === "thumbnails") {
			element.value = "";
		} else {
			element.value = product[id];
		}
	});

	const label = document.querySelector(".file-upload__label");
	const defaultLabelText = "No se seleccionó ninguna imagen";
	label.textContent = defaultLabelText;
	label.title = defaultLabelText;
};

Array.prototype.forEach.call(
	document.querySelectorAll(".browse-btn"),
	(button) => {
		const hiddenInput = button.parentElement.querySelector(
			".file-upload__input"
		);
		const label = button.parentElement.querySelector(".file-upload__label");
		const defaultLabelText = "No se seleccionó ninguna imagen";

		// Set default text for label
		label.textContent = defaultLabelText;
		label.title = defaultLabelText;

		button.addEventListener("click", function () {
			hiddenInput.click();
		});

		hiddenInput.addEventListener("change", function () {
			const filenameList = Array.prototype.map.call(
				hiddenInput.files,
				function (file) {
					return file.name;
				}
			);

			label.textContent = filenameList.join(", ") || defaultLabelText;
			label.title = label.textContent;
		});
	}
);
