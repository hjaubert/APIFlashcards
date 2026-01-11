import { request,response } from "express"
import bcrypt from 'bcrypt'
import { db } from "../db/database.js"
import { users } from "../db/schema.js"
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken"
import 'dotenv/config'


/**
 * method for creating a user
 * @param {request} req (email,firstname,lastname,password,isAdmin)
 * @param {response} res 
 * @returns status 201 and the user created
 */
export const register = async (req,res) => {
    try{
        const {email,firstname,lastname,password,isAdmin} = req.body

        const hashedPassword = await bcrypt.hash(password,12)

        //insert the user into the database
        const [newUsers] = await db.insert(users).values({
            email,
            firstname,
            lastname,
            isAdmin,
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

/**
 * method for get a user
 * @param {request} req (email,password)
 * @param {response} res 
 * @returns status 200 and user information
 */
export const login = async (req,res) => {
    try{
        const {email,password} = req.body

        const [user] = await db.select().from(users).where(eq(users.email, email))

        if(!user){
            return res.status(401).json({
                error:'invalid email or password',
            })
        }

        const isValidPassword= await bcrypt.compare(password,user.password)

        if(!isValidPassword){
            return res.status(401).json({
                error:'invalid email or password',
            })
        }

        const token = jwt.sign({userId: user.id},process.env.JWT_SECRET,{expiresIn: '24h'})


        res.status(200).json({
            message: "user logged in",
            userData: {
                email: user.email,
                username: user.username,
                id: user.id
            },
            token:token, 
        })
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            error:'login failed',
        })
    }
}