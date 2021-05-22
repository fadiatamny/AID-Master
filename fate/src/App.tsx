import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import GameScreen from './pages/GameScreen'
import EventsManager, { SocketEvent } from './services/EventsManager'
import SocketManager from './services/SocketManager'

export default function App() {
    const eventsManager = EventsManager.instance
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const socketInstance = SocketManager.instance

    eventsManager.on(SocketEvent.CONNECTED, 'app', () => {
        console.log('App:Socket Connected')
    })
    eventsManager.on(SocketEvent.ERROR, 'app', (e: unknown) => {
        console.error('Error Occured: ', e)
    })
    return (
        <Router>
            <Route path="/" exact component={GameScreen} />
        </Router>
    )
}
