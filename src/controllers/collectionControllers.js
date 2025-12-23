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
                return res.status(500).json({
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