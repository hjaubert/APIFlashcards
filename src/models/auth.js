import z from "zod";

export const registerSchema = z.object({
    email:z.email(),
    firstname: z.string().min(3).max(30),
    lastname: z.string().min(3).max(50),
    password: z.string().min(6).max(255),
    isAdmin: z.boolean()
})

export const loginSchema = z.object({
    email:z.email(),
    password: z.string().min(6).max(255)
})