import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-notifications/lib/notifications.css'
import './App.css'
import GameScreen from './pages/GameScreen'
import StartingScreen from './pages/HomePage'
import AdventureLoginScreen from './pages/AdvLogin'
import Feedback from './pages/Feedback'
import DMLoginScreen from './pages/DMLogin'
import SocketManager from './services/SocketManager'
import EventsManager from './services/EventsManager'
import { SocketEvents } from './models/SocketEvents.model'
import { v4 as uuid } from 'uuid'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import MetaTags from 'react-meta-tags'

export default function App() {
    const eventsManager = EventsManager.instance
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const socketInstance = SocketManager.instance

    eventsManager.on(SocketEvents.CONNECTED, 'app', () => {
        console.log('App:Socket Connected')
    })
    eventsManager.on(SocketEvents.ERROR, 'app', (e: unknown) => {
        console.error('Error Occured: ', e)
        NotificationManager.error('Error Occured', 2000)
    })

    if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', uuid())
    }

    return (
        <div className="App">
            <MetaTags>
                <title>AID Master</title>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                />
            </MetaTags>

            <Router>
                <Route path="/" exact component={StartingScreen} />
                <Route path="/game" component={GameScreen} />
                <Route path="/AdventurerLogin" component={AdventureLoginScreen} />
                <Route path="/DMLogin" component={DMLoginScreen} />
                <Route path="/feedback" component={Feedback} />
            </Router>
            <NotificationContainer />
        </div>
    )
}
