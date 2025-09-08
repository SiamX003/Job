import { Router } from "express";
import {
    getProfileController,
    loginUserController,
    logoutController,
    registerUserController,
    verifyEmailController,
} from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginUserController);
userRouter.get("/logout", auth, logoutController);
userRouter.get("/profile", auth, getProfileController);

export default userRouter;
