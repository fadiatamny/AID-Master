import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import api from './router/api'
import logger from 'morgan'
import winston from 'winston'

const loggerFile = winston.createLogger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './logs/all-logs.log',
            handleExceptions: true,
            maxsize: 5242880, //5MB
            maxFiles: 5
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true
        })
    ],
    exitOnError: false
})

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

if (process.env.ENV === 'production') {
    app.use(
        logger('common', {
            stream: {
                write: (message) => loggerFile.info(message)
            }
        })
    )
} else {
    app.use(logger('dev'))
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
