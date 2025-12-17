import { register } from "../controllers/authControllers.js";
import Router from "express";

import {validateBody} from "../middleware/validation.js"
import {registerSchema} from "../models/auth.js"

const router = Router()

router.post('/register',validateBody(registerSchema),register)

export default router