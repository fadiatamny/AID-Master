import { BrowserRouter as Router, Route } from 'react-router-dom'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import HomePage from './pages/StartingPages/HomaPage'
import AdvLoginScreen from './pages/StartingPages/AdvLoginScreen'
import DMLoginScreen from './pages/StartingPages/DMLoginScreen'
import NewGame from './pages/StartingPages/DM/NewGame'
import UploadGame from './pages/StartingPages/DM/UploadGame'
import Test from './pages/Test'

export default function App() {
    return (
        <Router>
            <Route path="/" exact component={HomePage} />
            <Route path="/AdventurerLogin" component={AdvLoginScreen} />
            <Route path="/DMLogin" component={DMLoginScreen} />
            <Route path="/newGame" component={NewGame} />
            <Route path="/gameUpload" component={UploadGame} />
            <Route path="/test" component={Test} />
        </Router>
    )
}
