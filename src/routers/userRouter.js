import e, { Router } from 'express';
import { getAllUsers} from '../controllers/usersControllers.js';

const userRouter = Router();

userRouter.get('/', getAllUsers);

export default userRouter;