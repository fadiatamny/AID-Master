import * as dotenv from 'dotenv'
dotenv.config()

import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

import app from './app'
import GameService from './services/Game.service'

const port = process.env.PORT || 5069
app.set('port', port)

const server = createServer(app)

const io = new Server(server, {
    cors: {
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
        methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
        origin: process.env.API_URL || 'localhost',
        preflightContinue: false,
        credentials: true
    }
})

io.sockets.on('connection', (socket: Socket) => {
    GameService.init(io, socket)
})

server.listen(app.get('port'), () => {
    console.log(`Server Listening on port ${port}`)
})
