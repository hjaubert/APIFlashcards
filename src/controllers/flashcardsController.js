import { eq, and, lt } from "drizzle-orm"
import { db } from "../db/database.js"
import { flashcards, collections, users, revisions } from "../db/schema.js"

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

async function accessVerification(collectionId,userId){
    const [getCollection] = await db.select().from(collections).where(eq(collections.id, collectionId));

        if(!getCollection.isPublic){

            const [getUser] = await db.select().from(users).where(eq(users.id, userId));

            if(getCollection.userId != userId && !getUser.isAdmin){
                return false
            }
        }
    return true
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

        const {userId} = req.user

        if (!accessVerification(searchedFlashcard.collectionId,userId)){
            return res.status(403).json({
                message: 'You did not have the right to access this Flashcard.',
            })
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

    const { collectionId } = req.params

    try {

        const {userId} = req.user

        if (!accessVerification(collectionId,userId)){
            return res.status(403).json({
                message: 'You did not have the right to access this Flashcard.',
            })
        }

        const result = await db.select().from(flashcards).where(eq(flashcards.collectionId, collectionId)).orderBy("created_at", "desc")

        if(result.length == 0){
            return res.status(404).json({
                message: "Flashcard not found"
            })
        }

        res.status(200).json(result)

    } catch(error){
        console.error(error)
        res.status(500).send({
            error: 'Failed to query flashcards',
        })
    }
}

export const getReviseFlashcards = async (req, res) => {

    const { collectionId } = req.params

    try {

        const {userId} = req.user

        if (!accessVerification(collectionId,userId)){
            return res.status(403).json({
                message: 'You did not have the right to access this Flashcard.',
            })
        }

        const result = await db.select().from(flashcards).innerJoin(revisions,eq(flashcards.id,revisions.flashcardId)).where(and( eq(flashcards.collectionId, collectionId) ,lt(revisions.nextRevision, new Date()) )).orderBy("created_at", "desc")

        if(result.length == 0){
            return res.status(404).json({
                message: "Flashcard not found"
            })
        }

        res.status(200).json(result)

    } catch(error){
        console.error(error)
        res.status(500).send({
            error: 'Failed to query flashcards',
        })
    }
}

export const modifyFlashCard = async (req, res) => {
    const { id } = req.params

    try {
        const [getFlashCard] = await db.select().from(flashcards).where(eq(flashcards.id, id))

        if(getFlashCard.length == 0){
            return res.status(404).json({
                message: "Flashcard not found"
            })
        }


        const [getCollection] = await db.select().from(collections).where(eq(collections.id, getFlashCard.collectionId))
        const {userId} = req.user

        if (!getCollection.userId != userId){
            return res.status(403).json({
                message: 'You did not have the right to access this Flashcard.',
            })
        }

        const { front, back, frontUrl, backUrl } = req.body;

        if(front != null){
            await db.update(flashcards).set({front: front}).where(eq(flashcards.id,id))
        }
        if(back != null){
            await db.update(flashcards).set({back: back}).where(eq(flashcards.id,id))
        }
        if(frontUrl != null){
            await db.update(flashcards).set({frontUrl: frontUrl}).where(eq(flashcards.id,id))
        }
        if(backUrl != null){
            await db.update(flashcards).set({backUrl: backUrl}).where(eq(flashcards.id,id))
        }

        res.status(200).json(result)

    } catch(error){
        console.error(error)
        res.status(500).send({
            error: 'Failed to query flashcards',
        })
    }
}

export const deleteQuestion = async (req, res) => {
    const { id } = req.params

    try {

        const [getFlashCard] = await db.select().from(flashcards).where(eq(flashcards.id, id))

        if(getFlashCard.length == 0){
            return res.status(404).json({
                message: "Flashcard not found"
            })
        }


        const [getCollection] = await db.select().from(collections).where(eq(collections.id, getFlashCard.collectionId))
        const {userId} = req.user

        if (!getCollection.userId != userId){
            return res.status(403).json({
                message: 'You did not have the right to access this Flashcard.',
            })
        }
        
        const [deleteFlashcard] = await db.select().from(flashcards).where(eq(id, flashcards.id))

    } catch(error){

    }
}