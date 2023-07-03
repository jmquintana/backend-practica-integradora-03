console.log("loaded product.js");

const cartId = document.querySelector(".list-container").id;
const form = document.querySelector(".add-form");
const logOutBtn = document.querySelector(".profile-logout");
const cartBadge = document.querySelector(".cart-badge");

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const productId = e.target.id;
	console.log({ productId }, { cartId });
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
			});
		showAlert("Product added to cart", "success");
	} catch (error) {
		console.log(error);
	}
});

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
