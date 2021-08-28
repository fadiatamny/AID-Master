import * as dotenv from 'dotenv'
dotenv.config()

const evnDependencies = [
    process.env.PUBLIC_URI,
    process.env.AMNESIA_URI,
    process.env.FATE_URI,
    process.env.BLEACH_URI,
    process.env.SOCKET_IO_ADMIN_USER,
    process.env.SOCKET_IO_ADMIN_PASSWORD
]

for (const dependency of evnDependencies) {
    if (!dependency) {
        console.error('Enviroment variables for SocketIO admin ui need to be set.')
        process.exit(9) // exit code for required value not given
    }
}

import { hashSync } from 'bcrypt'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import { instrument } from '@socket.io/admin-ui'
import cors from 'cors'

import app from './app'
import GameService from './services/Game.service'

const port = process.env.PORT || 5069
app.set('port', port)

const whitelist = [
    process.env.PUBLIC_URI,
    process.env.AMNESIA_URI,
    process.env.FATE_URI,
    process.env.BLEACH_URI,
    'https://admin.socket.io/',
    'http://localhost'
]

const corsOptions: cors.CorsOptions = {
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: (origin: any, callback: any) => {
        if (!origin || whitelist.indexOf(origin) !== -1) {
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

const saltRounds = Number(process.env.SALT_ROUNDS ?? 10)

instrument(io, {
    auth: {
        type: 'basic',
        username: process.env.SOCKET_IO_ADMIN_USER!,
        password: hashSync(process.env.SOCKET_IO_ADMIN_PASSWORD!, saltRounds)
    }
})

server.listen(app.get('port'), () => {
    console.log(`Server Listening on port ${port}`)
})
