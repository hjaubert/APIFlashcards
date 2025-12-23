import Router from "express";
import { createCollection, getCollection, getMyCollection, searchCollection } from "../controllers/collectionControllers.js";
import { createCollectionSchema } from "../models/collection.js";
import { validateBody } from "../middleware/validation.js";
import { authenticateToken } from "../middleware/authenticateToken.js";


const router = Router()

router.use(authenticateToken)

router.get("/me",getMyCollection);
router.get("/:id",getCollection);
router.get("/search/:title",searchCollection);
router.post("/",validateBody(createCollectionSchema),createCollection);


export default router