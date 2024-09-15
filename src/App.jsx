import { useState, useEffect } from "react";
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import 'rsuite/dist/rsuite.min.css';
import { BrowserRouter as Router } from 'react-router-dom';
import SideMenu from './components/SideMenu/';
import Login from './components/Login/';

function App() {
  const urlBase = import.meta.env.VITE_DEVELOP_URL_API;
  const apiLogin = urlBase + 'login';
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (credentials) => {
    console.log(credentials);
    
    try {
      const response = await fetch(apiLogin, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
      } else {
        alert('Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <Router>
      {isAuthenticated ? <SideMenu /> : <Login onLogin={handleLogin} />}
    </Router>
  );
}

export default App;