import { Router } from "express";
import { validateBody } from "../middleware/validation.js";
import { createFlashcardSchema } from "../models/flashcard.js";
import { createFlashcard, deleteQuestion, getAllFlashcards, getReviseFlashcards, getFlashCard, modifyFlashCard, reviseFlashcards } from "../controllers/flashcardsController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = Router()

router.use(authenticateToken)

router.post('/', validateBody(createFlashcardSchema), createFlashcard)
router.get('/revise/:flashcardId',reviseFlashcards)
router.get('/:id', getFlashCard)
router.get('/:collectionId/all', getAllFlashcards)
router.get('/:collectionId/revise', getReviseFlashcards)
router.put('/:id', modifyFlashCard)
router.delete('/:id', deleteQuestion)

export default router
