import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import GameScreen from './pages/GameScreen'

export default function App() {
    return (
        <Router>
            <Route path="/" exact component={GameScreen} />
        </Router>
    )
}
