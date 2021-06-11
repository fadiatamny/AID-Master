import { Request, Response } from 'express'
import GameService from '../services/Game.service'

export default class GameController {
    public static DownloadSession(req: Request, res: Response) {
        const id = req.params.id
        try {
            const session = GameService.getGameSession(id)
            const data = JSON.stringify(session.toJson())
            res.setHeader('Content-disposition', `attachment; filename= session_${id}.json`)
            res.setHeader('Content-type', 'application/json')
            res.json(data)
        } catch (err) {
            res.status(err.status ?? 500).send({ message: `Error occured`, error: err.message })
        }
    }
}
