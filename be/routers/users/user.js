import { Router } from "express";
import UserController from "../../controllers/users/userController.js";

const userRouter = Router()

const usercontroller = new UserController()

userRouter.get('/user', usercontroller.listUser)
// userRouter.put('/user/password/:id', usercontroller.updatePassword)
userRouter.put('/user/:id', usercontroller.updateUser)
userRouter.post('/signup', usercontroller.signup)
userRouter.post('/signin', usercontroller.signin)

export default userRouter