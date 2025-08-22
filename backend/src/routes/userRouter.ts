import express from "express";
import { userRegister, userLogin, refreshToken, userLogout, getUsers } from "../controllers/User";

const userRouter = express.Router();

userRouter.post('/register', userRegister);
userRouter.post('/login', userLogin);
userRouter.post('/refresh', refreshToken);
userRouter.post('/logout', (req, res) => userLogout(res));
userRouter.get('/all', getUsers);

export default userRouter;
