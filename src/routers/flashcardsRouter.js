import { Router } from "express";
import { validateBody, validateParams } from "../middleware/validation.js";
import { createFlashcardSchema } from "../models/flashcard.js";
import { createFlashcard, deleteQuestion, getAllFlashcards, getFlashCard, modifyFlashCard } from "../controllers/flashcardsController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = Router()

router.use(authenticateToken)

router.post('/', validateBody(createFlashcardSchema), createFlashcard)
router.get('/:id', getFlashCard)
router.get('/', getAllFlashcards)
router.patch('/:id', modifyFlashCard)
router.delete('/:id', deleteQuestion)

export default router
