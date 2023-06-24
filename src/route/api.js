import exports  from "express"
import userController from "../controller/user-controller.js"
import express from "express";
import {authMiddleware} from "../middleware/auth-middleware.js";


const userRouter = new express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.get('/api/users/current', userController.get);
userRouter.patch('/api/users/current', userController.update);




export {
    userRouter
}