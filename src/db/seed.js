import { db } from './database.js'
import { users, collections, flashcards, revisions } from './schema.js'
import { hash } from 'bcrypt'

const seed = async () =>{
    console.log('---------------------------------------')
    console.log('Starting database seeding')

    try {
        await db.delete(users)
        await db.delete(collections)
        await db.delete(flashcards)
        await db.delete(revisions)

        const hashedPassword1 = await hash('motdepasse', 12)
        const hashedPassword2 = await hash('123456789', 12)

        const SeedUsers = [
            {
                email: "clementMoisson@wanadoo.com",
                firstname: "Clément",
                lastname: "Moisson",
                password: hashedPassword1
            },
            {
                email: "julienMaganza@orange.fr",
                firstname: "Julien",
                lastname: "Maganza",
                password: hashedPassword2,
                isAdmin: true
            }
        ]

        const result = await db.insert(users).values(SeedUsers).returning()

        const SeedCollections = [
            {
                userId: result[0].id,
                title: 'Anglais',
                description: 'Collection regroupant les flashcards pour l\anglais',
                isPublic: true
            },
            {
                userId: result[0].id,
                title: 'Mathématiques',
                description: 'Collection regroupant les flashcards pour les mathématiques',
                isPublic: false
            }
        ]

        await db.insert(collections).values(SeedCollections)

        console.log('---------------------------------------')
        console.log('Database seeded succesfully')
        console.log('---------------------------------------')
        console.log('Login with this user (regular user) :')
        console.log('email :', result[0].email)
        console.log('password : motdepasse')
        console.log('---------------------------------------')
        console.log('Or this user (admin)')
        console.log('email :', result[0].email)
        console.log('password : motdepasse')
        console.log('---------------------------------------')

    } catch(error) {
        console.log(error)
    }
}

seed()