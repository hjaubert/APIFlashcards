import { eq, and, lt } from "drizzle-orm"
import { db } from "../db/database.js"
import { flashcards, collections, users, revisions } from "../db/schema.js"

/**
 * method for creating a flashcard
 * @param {Request} req 
 * @param {Response} res 
 * @returns status 201 and the flashcard created
 */
export const createFlashcard = async (req, res) => {
    try {

        const { collectionId, front, back, frontUrl, backUrl } = req.body
        const {userId} = req.user

        const [getCollection] = await db.select().from(collections).where(eq(collections.id, collectionId))

        // check if he has permission
        if (getCollection.userId != userId){
            return res.status(403).json({
                message: 'You did not have the right to access this Flashcard.',
            })
        }

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
 * funtion check if he has permission
 * @param {*} collectionId 
 * @param {*} userId 
 */
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
 * method to retrieve a flashcard
 * @param {Request} req (id)
 * @param {Response} res 
 * @returns status 200 and the flashcard
 */
export const getFlashCard = async (req, res) => {

    try {
        const { id } = req.params
        const [searchedFlashcard] = await db.select().from(flashcards).where(eq(flashcards.id, id))

        if(!searchedFlashcard){
            return res.status(404).json({
                message: "Flashcard not found"
            })
        }

        const {userId} = req.user

        //check if he has permission

        const hasAccess = await accessVerification(searchedFlashcard.collectionId, userId);

         if (!hasAccess){
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

/**
 * method to retrieve a flashcard from a collection
 * @param {Request} req (collectionId)
 * @param {Response} res 
 * @returns status 200 and list of flashcard
 */
export const getAllFlashcards = async (req, res) => {

    try {
        const { collectionId } = req.params

        const {userId} = req.user

        // check if he has permission
        const hasAccess = await accessVerification(collectionId, userId);

        if (!hasAccess){
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

/**
 * method to retrieve a flashcard to review from a collection
 * @param {Request} req (collectionId)
 * @param {Response} res 
 * @returns status 200 and list of flashcard
 */
export const getReviseFlashcards = async (req, res) => {
    try {
        
        const { collectionId } = req.params
        const {userId} = req.user

        // check if he has permission
        const hasAccess = await accessVerification(collectionId, userId);

        if (!hasAccess){
            return res.status(403).json({
                message: 'You did not have the right to access this Flashcard.',
            })
        }

        const result = await db.select({
            id: flashcards.id,
            collectionId: flashcards.collectionId,
            front: flashcards.front,
            back: flashcards.back,
            frontUrl: flashcards.frontUrl,
            backUrl: flashcards.backUrl,
            createdAt: flashcards.createdAt
        }).from(flashcards)
        .innerJoin(revisions,eq(flashcards.id,revisions.flashcardId))
        .where(and( eq(flashcards.collectionId, collectionId) ,eq(revisions.userId,userId)  ,lt(revisions.nextRevision, new Date()) ))
        .orderBy("created_at", "desc")

        if(result.length == 0){
            return res.status(200).json({
                message: "No flashcards to review"
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

/**
 * method for updating flashcard
 * @param {Request} req (id)
 * @param {Response} res 
 * @returns status 200
 */
export const modifyFlashCard = async (req, res) => {

    try {
        const { id } = req.params
        const [getFlashCard] = await db.select().from(flashcards).where(eq(flashcards.id, id))

        if(getFlashCard.length == 0){
            return res.status(404).json({
                message: "Flashcard not found"
            })
        }

        // check if he has permission
        const [getCollection] = await db.select().from(collections).where(eq(collections.id, getFlashCard.collectionId))
        const {userId} = req.user

        if (getCollection.userId != userId){
            return res.status(403).json({
                message: 'You did not have the right to access this Flashcard.',
            })
        }

        //updates the flashcard
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

        res.status(200).send({ message: "Flashcards updated"});

    } catch(error){
        console.error(error)
        res.status(500).send({
            error: 'Failed to update flashcards',
        })
    }
}

/**
 * method of deleting flashcard
 * @param {request} req (id)
 * @param {response} res 
 * @returns status 200
 */
export const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params
        const [getFlashCard] = await db.select().from(flashcards).where(eq(flashcards.id, id))

        if(getFlashCard.length == 0){
            return res.status(404).json({
                message: "Flashcard not found"
            })
        }

        // check if he has permission
        const [getCollection] = await db.select().from(collections).where(eq(collections.id, getFlashCard.collectionId))
        const {userId} = req.user

        if (getCollection.userId != userId){
            return res.status(403).json({
                message: 'You did not have the right to access this Flashcard.',
            })
        }
        
        await db.delete(flashcards).where(eq(flashcards.id, id));

        res.status(200).send({ message: "Flashcards deleted"});

    } catch(error){
        console.error(error)
        res.status(500).send({
            error: 'Failed to delete flashcards',
        })
    }
}

/**
 * funtion check next day to revise
 * @param {*} level
 */
function nextDay(level){
    switch(level){
        case 1:
            return 1
        case 2 :
            return 2
        case 3 :
            return 4
        case 4 :
            return 8
        case 5 :
            return 16
        default :
            return 16
    }
}


/**
 * method of revise a Flashcards
 * @param {request} req (flashcardId)
 * @param {response} res 
 * @returns status 201 if revise created or 200 is update
 */
export const reviseFlashcards = async (req, res) => {

    try {
        const { flashcardId } = req.params
        const {userId} = req.user

        const [getRevisions] = await db.select().from(revisions).where(and (eq(revisions.flashcardId, flashcardId), eq(revisions.userId, userId)) )

        const now = new Date();

        if(!getRevisions){

            const nextDate = new Date();
            nextDate.setDate(now.getDate() + 1);

            const newRevisions = await db.insert(revisions).values({
                flashcardId,
                userId,
                level : 1,
                lastRevision : now,
                nextRevision : nextDate
            }).returning()

            res.status(201).json({
                message: 'Revision created',
                data: newRevisions
            })
        }
        else{

            //updates Revisions

            if(getRevisions.level != 5){
                await db.update(revisions).set({level: getRevisions.level+1}).where(and (eq(revisions.flashcardId, flashcardId), eq(revisions.userId, userId)))
            }

            await db.update(revisions).set({lastRevision: now}).where(and (eq(revisions.flashcardId, flashcardId), eq(revisions.userId, userId)))

            const nextDate = new Date();
            nextDate.setDate(now.getDate() + nextDay(getRevisions.level+1));

            await db.update(revisions).set({nextRevision: nextDate}).where(and (eq(revisions.flashcardId, flashcardId), eq(revisions.userId, userId)))

            const [newRevisions] = await db.select().from(revisions).where(and (eq(revisions.flashcardId, flashcardId), eq(revisions.userId, userId)) )

            res.status(200).json({
                message: 'Revision update',
                data: newRevisions
            })
        }

    } catch(error){
        console.error(error)
        res.status(500).send({
            error: 'Failed to update Revision',
        })
    }
}