import { ZodError, ZodType } from 'zod'


export const validateBody = (schema) => {
    return (req, res, next) => {
        try{
            if(schema instanceof ZodType){
                req.body = schema.parse(req.body)
                next()
            }
        }
        catch(error){
            if(error instanceof ZodError){
                return res.status(400).send({
                    error: 'Invalid body',
                    details: error.issues
                })
            }
            console.log(error)
            res.status(500).send({
                error: 'Internal Serveur error'
            })
        }
    }
}