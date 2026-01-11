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

        const usersResult = await db.insert(users).values(SeedUsers).returning()

        const SeedCollections = [
            {
                userId: usersResult[0].id,
                title: 'Anglais',
                description: 'Collection regroupant les flashcards pour l\'anglais',
                isPublic: true
            },
            {
                userId: usersResult[0].id,
                title: 'Mathématiques',
                description: 'Collection regroupant les flashcards pour les mathématiques',
                isPublic: false
            }
        ]

        const collectionsResult = await db.insert(collections).values(SeedCollections).returning()

        const SeedFlashcards = [
            {
                collectionId: collectionsResult[0].id,
                front: 'Stage',
                back: 'Internship'
            },
            {
                collectionId: collectionsResult[0].id,
                front: 'Entreprise',
                back: 'Company'
            },
            {
                collectionId: collectionsResult[1].id,
                front: '1+1',
                back: '2'
            },
            {
                collectionId: collectionsResult[1].id,
                front: '2x2',
                back: '4'
            }
        ]

        const flashcardsResult = await db.insert(flashcards).values(SeedFlashcards).returning()

        const SeedRevisions = [
            {
                flashcardId: flashcardsResult[1].id,
                userId: usersResult[0].id,
                level: 4,
                nextRevision: (() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 8);
                    return d;
                })()
            }, 
            {
                flashcardId: flashcardsResult[1].id,
                userId: usersResult[0].id,
                level: 2,
                nextRevision: (() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 2);
                    return d;
                })()
            },
            {
                flashcardId: flashcardsResult[1].id,
                userId: usersResult[0].id,
                level: 3,
                nextRevision: (() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 4);
                    return d;
                })()
            },
            {
                flashcardId: flashcardsResult[1].id,
                userId: usersResult[0].id,
                level: 1,
                nextRevision: (() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 1);
                    return d;
                })()
            }
        ]

        await db.insert(revisions).values(SeedRevisions)

        console.log('---------------------------------------')
        console.log('Database seeded succesfully')
        console.log('---------------------------------------')
        console.log('Login with this user (regular user) :')
        console.log('email :', usersResult[0].email)
        console.log('password : motdepasse')
        console.log('---------------------------------------')
        console.log('Or this user (admin)')
        console.log('email :', usersResult[1].email)
        console.log('password : 123456789')
        console.log('---------------------------------------')

    } catch(error) {
        console.log(error)
    }
}

seed()