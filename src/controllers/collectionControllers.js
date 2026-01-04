import { request,response } from "express";
import { db } from "../db/database.js";
import {collections,users } from "../db/schema.js"
import { eq, and } from "drizzle-orm";

/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const createCollection = async (req, res) => {
    const { title, description , isPublic } = req.body;

    const {userId} = req.user

    try{
        const newCollection = await db.insert(collections).values({
            userId,
            title,
            description,
            isPublic
        }).returning()

        res.status(201).send({ message: "Collection created", data: newCollection });

    }
    catch(error){
        console.log(error)
        res.status(500).json({
            error: 'Failed to create collection'
        })
    }
}

export const getCollection = async (req, res) => {

    try{
        const { id } = req.params;
        const [getCollection] = await db.select().from(collections).where(eq(collections.id, id));

        if(!getCollection){
            return res.status(404).json({
                message:"Collection not found",
            })
        }
        if(!getCollection.isPublic){

            const {userId} = req.user

            const [getUser] = await db.select().from(users).where(eq(users.id, userId));

            if(getCollection.userId != userId && !getUser.isAdmin){
                return res.status(403).json({
                    message: 'You did not have the right to access this collection.',
                })
            }
        }

        res.status(201).send({ message: "Collection found",data: getCollection});

    }
    catch(error){
        console.log(error)
        res.status(500).json({
            error: 'Failed to get Collection'
        })
    }
}

export const getMyCollection = async (req, res) => {

    try{
        const {userId} = req.user
        const getCollection = await db.select().from(collections).where(eq(collections.userId, userId));

        if(!getCollection){
            return res.status(404).json({
                message:"Collection not found",
            })
        }

        res.status(201).send({ message: "Collection found",data: getCollection});

    }
    catch(error){
        console.log(error)
        res.status(500).json({
            error: 'Failed to get your Collection'
        })
    }
}

export const searchCollection = async (req, res) => {

    try{
        const { title } = req.params;

        const getCollection = await db.select().from(collections).where(and( eq(collections.title, title), eq(collections.isPublic,true) ) );

        if(!getCollection){
            return res.status(404).json({
                message:"Collection not found",
            })
        }

        res.status(201).send({ message: "Collection found",data: getCollection});

    }
    catch(error){
        console.log(error)
        res.status(500).json({
            error: 'Failed to get Collection'
        })
    }
}

export const changeCollection = async (req, res) => {

    try{
        const { id } = req.params;
        const [getCollection] = await db.select().from(collections).where(eq(collections.id, id));

        if(!getCollection){
            return res.status(404).json({
                message:"Collection not found",
            })
        }
        
        const {userId} = req.user


        if(getCollection.userId != userId){
            return res.status(403).json({
                message: 'You did not have the right to update this collection.',
            })
        }
        
        const { title, description , isPublic } = req.body;

        if(title != undefined){
            await db.update(collections).set({title: title}).where(eq(collections.id,id))
        }
        if(description != undefined){
            await db.update(collections).set({description: description}).where(eq(collections.id,id))
        }
        if(isPublic != undefined){
            await db.update(collections).set({isPublic: isPublic}).where(eq(collections.id,id))
        }

        res.status(201).send({ message: "Collection updated"});

    }
    catch(error){
        console.log(error)
        res.status(500).json({
            error: 'Failed to update Collection'
        })
    }
}

export const deleteCollection = async (req, res) => {

    try{
        const { id } = req.params;
        const [getCollection] = await db.select().from(collections).where(eq(collections.id, id));

        if(!getCollection){
            return res.status(404).json({
                message:"Collection not found",
            })
        }
        
        const {userId} = req.user


        if(getCollection.userId != userId){
            return res.status(403).json({
                message: 'You did not have the right to update this collection.',
            })
        }

        await db.delete(collections).where(eq(collections.id, id));

        res.status(201).send({ message: "Collection deleted"});




    }
    catch(error){
        console.log(error)
        res.status(500).json({
            error: 'Failed to update Collection'
        })
    }
}