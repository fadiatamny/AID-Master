import { BrowserRouter as Router, Route } from 'react-router-dom'
import './index.css'
import Test from './pages/Test'

export default function App() {
    return (
        <Router>
            <Route path="/" exact component={Test} />
        </Router>
    )
}