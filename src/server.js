import express from 'express'
import flashcardsRouter from './routers/flashcardsRouter.js'

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

app.use('/flashcards', flashcardsRouter)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})