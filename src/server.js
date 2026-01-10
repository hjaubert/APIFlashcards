import express from 'express'
import flashcardsRouter from './routers/flashcardsRouter.js'
import authRouter from './routers/authRouter.js';
import collectionRouter from './routers/collectionRouter.js'

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

app.use('/flashcards', flashcardsRouter)

app.use('/auth', authRouter)

app.use('/collection', collectionRouter)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})