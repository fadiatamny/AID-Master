import * as dotenv from 'dotenv'
dotenv.config()

import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import cors from 'cors'

import app from './app'
import GameService from './services/Game.service'

const port = process.env.PORT || 5069
app.set('port', port)

const whitelist = [process.env.AMNESIA_URI, process.env.FATE_URI, process.env.BLEACH_URI]

const corsOptions: cors.CorsOptions = {
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

app.use(cors(corsOptions))

const server = createServer(app)

const io = new Server(server, { cors: corsOptions })

io.sockets.on('connection', (socket: Socket) => {
    GameService.init(io, socket)
})

server.listen(app.get('port'), () => {
    console.log(`Server Listening on port ${port}`)
})
