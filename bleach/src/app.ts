import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import api from './router/api'
import logger from 'morgan'
import winston from 'winston'
import { ResponseError } from './models/ResponseError.model'

// Boot express
const app: Application = express()

const whitelist = [process.env.AMNESIA_URI, process.env.FATE_URI, process.env.BLEACH_URI, 'localhost']

const options: cors.CorsOptions = {
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    preflightContinue: false,
    credentials: true
}

if (process.env.ENV === 'production') {
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

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome To AID Master Game Handler Service')
})

export default app
