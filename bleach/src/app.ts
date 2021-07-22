import express, { Application, Request, Response, NextFunction } from 'express'
import api from './router/api'
import logger from 'morgan'
import winston from 'winston'
import { ResponseError } from './models/ResponseError.model'

// Boot express
const app: Application = express()

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

app.use(express.json())
app.use(
    express.urlencoded({
        extended: false
    })
)

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
