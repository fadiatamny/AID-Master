import { Router, Request, Response } from 'express'
import GameController from '../controllers/Game.controller'

const router = Router()

router.get('/:id', (req: Request, res: Response) => {
    GameController.DownloadSession(req, res)
})

export default router
