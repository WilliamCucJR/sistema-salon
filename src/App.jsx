import './App.css';
import 'semantic-ui-css/semantic.min.css';
import 'rsuite/dist/rsuite.min.css';
import { BrowserRouter as Router } from 'react-router-dom';
import SideMenu from './components/SideMenu/';

function App() {
  return (
    <Router>
      <SideMenu />
    </Router>
  );
}

export default App;