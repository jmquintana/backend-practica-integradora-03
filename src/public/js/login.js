console.log("loaded login.js");

const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
	e.preventDefault();
	const formData = new FormData(form);
	const obj = {};
	formData.forEach((value, key) => (obj[key] = value));
	console.log(obj);

	try {
		await fetch("/api/sessions/login", {
			method: "POST",
			body: JSON.stringify(obj),
			header: {
				"Content-Type": "application/json",
			},
		}).then((res) => {
			if (res.status === 200) {
				window.location.href = "/";
			} else {
				setTimeout(() => (window.location.href = "/register"), 1500);
				const error = new Error(res.error);
				throw error;
			}
		});
	} catch (error) {
		showAlert("Unable to log in", "error");
		console.error(error);
	}
});
