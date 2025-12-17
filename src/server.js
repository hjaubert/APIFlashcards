import express from 'express'
import collectionRouter from './routers/collectionRouter.js'

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

app.use('/collection', collectionRouter)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})