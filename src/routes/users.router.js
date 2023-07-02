import { Router } from "express";
import passport from "passport";
import {
	restorePasswordProcess,
	updatePassword,
	failRegister,
	gitHubLogin,
	login,
	logout,
	register,
} from "../controllers/users.controller.js";

const usersRouter = Router();

usersRouter.post(
	"/register",
	passport.authenticate("register", {
		session: false,
		failureRedirect: "/api/users/failRegister",
	}),
	register
);
usersRouter.get("/failRegister", failRegister);
usersRouter.post("/login", login);
usersRouter.get(
	"/github",
	passport.authenticate("github", { scope: ["user:email"] }),
	async (req, res) => {}
);
usersRouter.get(
	"/githubcallback",
	passport.authenticate("github", {
		session: false,
		failureRedirect: "/login",
	}),
	gitHubLogin
);
usersRouter.post("/logout", logout);
usersRouter.post("/restore", restorePasswordProcess);
usersRouter.put("/resetPassword", updatePassword);

export default usersRouter;
