import { eq } from "drizzle-orm"
import { db } from "../db/database.js"
import { flashcards, collections, users } from "../db/schema.js"

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
export const createFlashcard = async (req, res) => {
    try {

        const { collectionId, front, back, frontUrl, backUrl } = req.body

        const newFlashcard = await db.insert(flashcards).values({
            collectionId,
            front,
            back,
            frontUrl,
            backUrl
        }).returning()

        res.status(201).json({
            message: 'Flashcard created',
            data: newFlashcard
        })

    } catch(error){
        console.error(error)
        res.status(500).send({
            error: 'Error when creating flashcard',
        })
    }
}


/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
export const getFlashCard = async (req, res) => {
    const { id } = req.params

    try {
        const [searchedFlashcard] = await db.select().from(flashcards).where(eq(flashcards.id, id))

        if(!searchedFlashcard){
            return res.status(404).json({
                message: "Flashcard not found"
            })
        }

        const [getCollection] = await db.select().from(collections).where(eq(collections.id, searchedFlashcard.collectionId));

        if(!getCollection.isPublic){

            const {userId} = req.user

            const [getUser] = await db.select().from(users).where(eq(users.id, userId));

            if(getCollection.userId != userId && !getUser.isAdmin){
                return res.status(403).json({
                    message: 'You did not have the right to access this Flashcard.',
                })
            }
        }

        res.status(200).json({
            message: `Flashcard found`,
            data: searchedFlashcard
        })
        
    } catch(error){
        console.error(error)
        res.status(500).json({
            message: "Error when searching flashcard",
        })
    }
}

export const getAllFlashcards = async (req, res) => {
    try {
        const result = await db.select().from(flashcards).orderBy("created_at", "desc")

        res.status(200).json(result)
    } catch(error){
        console.error(error)
        res.status(500).send({
            error: 'Failed to query flashcards',
        })
    }
}

export const modifyFlashCard = async (req, res) => {
    
}

export const deleteQuestion = async (req, res) => {
    const { id } = req.params

    try {
        const [deleteFlashcard] = await db.select().from(flashcards).where(eq(id, flashcards.id))

    } catch(error){

    }
}