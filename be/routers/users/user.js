import { Router } from "express";
import UserController from "../../controllers/users/userController.js";
import verifyEmailRouter from "./verifyEmailRouter.js";
import forgotPasswordRouter from "./forgotPasswordRouter.js";
// import resetPassword from "./resetPassword.js";
const userRouter = Router();

const usercontroller = new UserController();

userRouter.get("/user_account", usercontroller.listUserAccount);
userRouter.get("/admin_account", usercontroller.listAdminAccount);
userRouter.put("/update_user_account/:id", usercontroller.updateUserAccount);
userRouter.put("/update_admin_account/:id", usercontroller.updateAdminAccount);
userRouter.get("/admin_account/:id", usercontroller.getOneAdminAccount);
userRouter.get("/user_account/:id", usercontroller.getOneUserAccount);
userRouter.post("/signup_admin", usercontroller.signUpAdmin);
userRouter.post("/signup_user", usercontroller.signupUser);
userRouter.post("/signin", usercontroller.signinAdmin);
userRouter.post("/signin_user", usercontroller.signinUser);
userRouter.put(
  "/update_status_admin_account/:id",
  usercontroller.updateStatusAdminAccount
);
userRouter.put(
  "/update_status_user_account/:id",
  usercontroller.updateStatusUserAccount
);
userRouter.use("/verify-email", verifyEmailRouter);
userRouter.use("/forgot_password", forgotPasswordRouter);
// userRouter.use("/reset_password", resetPassword);
userRouter.put("/update_password/:id", usercontroller.updatePasswordUser);
userRouter.post("/login_google", usercontroller.loginGoogle);

export default userRouter;
