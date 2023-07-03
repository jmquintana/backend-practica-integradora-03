function checkRegistered(req, res, next) {
	if (req.session.user) return res.redirect("/login");
	next();
}

function checkLogin(req, res, next) {
	if (!req.session.user) return res.redirect("/login");
	next();
}

function checkSession(req, res, next) {
	if (req.session.user) return res.redirect("/");
	next();
}

function checkAdmin(req, res, next) {
	const isAdmin = req.user?.isAdmin || false;
	if (isAdmin) {
		next();
	} else {
		return res
			.status(403)
			.json({ message: "Acceso denegado. No eres un administrador." });
	}
}

function checkUser(req, res, next) {
	const role = req.user.role;
	if (role === "user") {
		next();
	} else {
		return res
			.status(403)
			.json({ message: "Acceso denegado. No eres un usuario." });
	}
}

export { checkRegistered, checkLogin, checkSession, checkAdmin, checkUser };
