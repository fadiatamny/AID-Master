import { BrowserRouter as Router, Route} from 'react-router-dom'
import Join from './components/Join/Join'
import Chat from './components/Chat/Chat'

import './index.css'

export interface IAppProps {
}

export default function App ({}: IAppProps) {
  return (
    <Router>
      <Route path="/" exact component={Join} />
      <Route path="/chat" component={Chat} />
    </Router>
  );
}
