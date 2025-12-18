import z from "zod";

export const createFlashcardSchema = z.object({
    collectionId: z.string(),
    front: z.string().
        min(1, 'Title must be at least 1 character').
        max(255, 'Title must be at most 255 characters'),
    back: z.string().
        min(1, 'Description must be at least 1 character').
        max(255, 'Description must be at most 255 characters'),
    frontUrl: z.string().
        max(255, 'Front URL must be at most 255 characters').nullish(),
    backUrl: z.string().
        max(255, 'Back URL must be at most 255 characters').nullish()
})