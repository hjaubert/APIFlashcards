import { getAllUsers, getUser } from "../controllers/adminControlleurs.js";
import Router from "express";

import { authenticateToken } from "../middleware/authenticateToken.js";

const router = Router();

router.use(authenticateToken)

router.get('/users',getAllUsers)
router.get('/user/:id',getUser)

export default router