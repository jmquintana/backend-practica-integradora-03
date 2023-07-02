import { Router } from "express";
import {
	restorePasswordProcess,
	updatePassword,
} from "../controllers/users.controller.js";

const usersRouter = Router();

usersRouter.post("/restore", restorePasswordProcess);
usersRouter.put("/resetPassword", updatePassword);

export default usersRouter;
