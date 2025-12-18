import { request,response } from "express"
import bcrypt from 'bcrypt'
import { db } from "../db/database.js"
import { users } from "../db/schema.js"
import { eq, desc} from "drizzle-orm";
import jwt from "jsonwebtoken"
import 'dotenv/config'


/**
 * 
 * @param {response} res 
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
            error: 'Failled to query questions'
        })
    }    
}
