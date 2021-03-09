
import * as dotenv from "dotenv";
dotenv.config()

import { createServer} from 'http'
import { Server, Socket } from 'socket.io'

import app from './app'
import { initSocket } from './services/gameService'

let port = process.env.PORT || 5069;
app.set('port',port);

const server = createServer(app);

const io = new Server(server);
io.sockets.on('connection', (socket: Socket) => {
    initSocket(io, socket);
});

server.listen(app.get('port'), () => {
    console.log(`Server Listening on port ${port}`);
});
