import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import api from './router/api'

interface ResponseError extends Error {
    status?: number
}

// Boot express
const app: Application = express()

const options: cors.CorsOptions = {
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: process.env.API_URL || 'localhost',
    preflightContinue: false,
    credentials: true
}

app.use(cors(options))

app.use(express.json())
app.use(
    express.urlencoded({
        extended: false
    })
)

// double cors!
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.set('Content-Type', 'application/json')
    next()
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    res.status(err.status || 500)
    res.send('Error Occured!\nPlease try again later')
})

app.use('/api', api)

export default app
