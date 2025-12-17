import { request,response } from "express"
import bcrypt from 'bcrypt'
import { db } from "../db/database.js"
import { users } from "../db/schema.js"
import jwt from "jsonwebtoken"
import 'dotenv/config'


/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const register = async (req,res) => {
    try{
        const {email,firstname,lastname,password,is_admin} = req.body

        const hashedPassword = await bcrypt.hash(password,12)

        const [newUsers] = await db.insert(users).values({
            email,
            firstname,
            lastname,
            isAdmin: is_admin,
            password: hashedPassword,
        }).returning({
            email: users.email,
            firstname : users.firstname,
            lastname : users.lastname,
            id : users.id,
        })

        const token = jwt.sign({userId: newUsers.id},process.env.JWT_SECRET,{expiresIn: '24h'})

        res.status(201).json({
            message: "user created",
            userData: newUsers,
            token:token, 
        })
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            error:'Register failed',
        })
    }
}