import {response } from "express"
import { db } from "../db/database.js"
import { users } from "../db/schema.js"
import { eq, desc} from "drizzle-orm";
import 'dotenv/config'


/**
 * method for get all user
 * @param {request} req
 * @param {response} res 
 * @returns status 200 and users list
 */
export const getAllUsers = async (req,res) => {
    try{

        const { userId } = req.user

        const isAdmin = await db.select().from(users).where(eq(users.id,userId))

        if(!isAdmin[0].isAdmin){
            return res.status(404).send({
                error: 'Page not found'
            })
        }

        const result = await db.select().from(users).orderBy(desc(users.createdAt))

        res.status(200).json(result)
    }
    catch(error){
        res.status(500).send({
            error: 'Failled to query users'
        })
    }    
}

/**
 * method for get one user
 * @param {request} req (userId)
 * @param {response} res 
 * @returns status 200 and user
 */
export const getUser = async (req,res) => {
    try{

        const { userId } = req.user
        const { id } = req.params

        const isAdmin = await db.select().from(users).where(eq(users.id,userId))

        if(!isAdmin[0].isAdmin){
            return res.status(404).send({
                error: 'Page not found'
            })
        }

        const result = await db.select().from(users).where(eq(users.id,id))

        if(!result[0]){
            return res.status(404).send({
                error: 'User not found'
            })
        }

        res.status(200).json(result[0])
    }
    catch(error){
        res.status(500).send({
            error: 'Failled to query user'
        })
    }    
}

/**
 * method for delete one user
 * @param {request} req (userId)
 * @param {response} res 
 * @returns status 200
 */
export const deleteUser = async (req,res) => {
    try{
        
        const { userId } = req.user
        const { id } = req.params

        const isAdmin = await db.select().from(users).where(eq(users.id,userId))

        if(!isAdmin[0].isAdmin){
            return res.status(404).send({
                error: 'Page not found'
            })
        }

        await db.delete(users).where(eq(users.id,id)).returning()


        res.status(201).json({message: 'User deleted successfully'})
    }

    catch(error){
        res.status(500).send({
            error: 'Failled to delete user',
            result: error.message
        })
    }    
}