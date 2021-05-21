import { Router, Request, Response } from 'express'
import sessionRouter from './session.router'

const router = Router()

router.get('/', (req: Request, res: Response) => {
    res.status(200).send('AID Master Backend Service')
})

router.use('/session', sessionRouter)

export default router
