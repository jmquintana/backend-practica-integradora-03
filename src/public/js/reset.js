console.log("loaded reset.js");

const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
	e.preventDefault();
	const formData = new FormData(form);
	const obj = {};
	formData.forEach((value, key) => (obj[key] = value));

	// get token from url query
	let params = new URL(document.location).searchParams;
	let token = params.get("token");
	obj.token = token;

	try {
		await fetch("/api/users/resetPassword", {
			method: "PUT",
			body: JSON.stringify(obj),
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
		showAlert("Unable to reset password", "error");
	}
});

const check = function () {
	if (
		document.getElementById("new-password").value ==
		document.getElementById("repeat-password").value
	) {
		document.getElementById("repeat-password").style.borderBottomColor =
			"#64a70b";
		document.getElementById("submit-btn").disabled = false;
	} else {
		document.getElementById("repeat-password").style.borderBottomColor =
			"#ac0006";
		document.getElementById("submit-btn").disabled = true;
	}
};
