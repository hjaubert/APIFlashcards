import { request,response } from "express";
import { db } from "../db/database.js";
import {collections } from "../db/schema.js"

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