import Router from "express";
import { createCollection } from "../controllers/collectionControllers.js";
import { createCollectionSchema } from "../models/collection.js";
import { validateBody } from "../middleware/vadidation.js";


const router = Router()

router.post("/",validateBody(createCollectionSchema),createCollection);

export default router