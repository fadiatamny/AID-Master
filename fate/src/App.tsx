import { BrowserRouter as Router, Route } from 'react-router-dom'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Test from './pages/Test'

export default function App() {
    return (
        <Router>
            <Route path="/" exact component={Test} />
        </Router>
    )
}
