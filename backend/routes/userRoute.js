import express from 'express';
import { createUser, getUser, updateUser } from '../Controller/userController.js';

const userRouter = express.Router();

//all user routes will be defined here
userRouter.post('/login', createUser);
userRouter.get('/:id', getUser);
userRouter.put('/:id', updateUser);

export default userRouter;