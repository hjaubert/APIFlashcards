import { z } from 'zod'

export const createCollectionSchema = z.object({
    title: z.string().min(1).max(255, "title text must be at most 255 characters"),
    description: z.string().max(255, "description text must be at less 255 characters"),
    isPublic: z.number().min(0).max(1),
})