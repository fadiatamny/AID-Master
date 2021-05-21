import { BrowserRouter as Router, Route } from 'react-router-dom'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import HomePage from './pages/StartingPages/HomaPage'
import AdvLoginScreen from './pages/StartingPages/AdvLoginScreen'
import DMLoginScreen from './pages/StartingPages/DMLoginScreen'
import NewGame from './pages/StartingPages/DM/NewGame'
import UploadGame from './pages/StartingPages/DM/UploadGame'
import GameScreen from './pages/GameScreen/GameScreen'
import EventsManager, { SocketEvent } from './services/EventsManager'

export default function App() {
    // const eventsManager = EventsManager.instance
    // eventsManager.on(SocketEvent.ERROR, 'app', (e: unknown) => {
    //     console.error('Error Occured: ', e)
    // })
    return (
        <Router>
            <Route path="/" exact component={GameScreen} />
            {/* <Route path="/AdventurerLogin" component={AdvLoginScreen} />
            <Route path="/DMLogin" component={DMLoginScreen} />
            <Route path="/newGame" component={NewGame} />
            <Route path="/gameUpload" component={UploadGame} />
            <Route path="/play" component={GameScreen} />
            <Route path="/test" component={Test} /> */}
        </Router>
    )
}
