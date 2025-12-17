import express from 'express'
import userRouter from './routers/userRouter.js';
import authRouter from './routers/authRouter.js';

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())


app.use('/users', userRouter)

app.use('/auth', authRouter)


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})