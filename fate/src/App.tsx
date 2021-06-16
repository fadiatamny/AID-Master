import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import GameScreen from './pages/GameScreen'
import StartingScreen from './pages/HomePage'
import AdvLoginScreen from './pages/AdvLogin'
import Feedback from './pages/Feedback'
import DMLoginScreen from './pages/DMLogin'
import SocketManager from './services/SocketManager'
import EventsManager from './services/EventsManager'
import { SocketEvents } from './models/SocketEvents.model'
import { v4 as uuid } from 'uuid'

export default function App() {
    const eventsManager = EventsManager.instance
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const socketInstance = SocketManager.instance

    eventsManager.on(SocketEvents.CONNECTED, 'app', () => {
        console.log('App:Socket Connected')
    })
    eventsManager.on(SocketEvents.ERROR, 'app', (e: unknown) => {
        console.error('Error Occured: ', e)
    })

    if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', uuid())
    }

    return (
        <Router>
            <Route path="/" exact component={StartingScreen} />
            <Route path="/game" component={GameScreen} />
            <Route path="/AdventurerLogin" component={AdvLoginScreen} />
            <Route path="/DMLogin" component={DMLoginScreen} />
            <Route path="/feedback" component={Feedback} />
        </Router>
    )
}
