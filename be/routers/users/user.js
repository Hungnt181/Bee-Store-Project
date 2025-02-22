import { Router } from "express";
import UserController from "../../controllers/users/userController.js";

const userRouter = Router()

const usercontroller = new UserController()

userRouter.get('/user_account', usercontroller.listUserAccount)
userRouter.get('/admin_account', usercontroller.listAdminAccount)
userRouter.put('/update_user_account/:id', usercontroller.updateUserAccount)
userRouter.put('/update_admin_account/:id', usercontroller.updateAdminAccount)
userRouter.get('/admin_account/:id', usercontroller.getOneAdminAccount)
userRouter.get('/user_account/:id', usercontroller.getOneUserAccount)
userRouter.post('/signup_admin', usercontroller.signupAdmin)
userRouter.post('/signup_user', usercontroller.signupUser)
userRouter.post('/signin', usercontroller.signin)
userRouter.put('/update_status_admin_account/:id', usercontroller.updateStatusAdminAccount)
userRouter.put('/update_status_user_account/:id', usercontroller.updateStatusUserAccount)

export default userRouter