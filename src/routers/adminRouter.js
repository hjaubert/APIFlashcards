import { getAllUsers } from "../controllers/adminControlleurs.js";
import Router from "express";

import { authenticateToken } from "../middleware/authenticateToken.js";

const router = Router();

router.use(authenticateToken)

router.get('/users',getAllUsers)

export default router