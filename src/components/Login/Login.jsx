import { useState } from 'react';
import { FormField, Button, Form } from "semantic-ui-react";
import Logo from "../../assets/logo-sistema.png";
import "./Login.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin({ USE_USER: username, USE_PASSWORD: password });
  };

  const handleRegister = () => {
    console.log("Register");
  };

  return (
    <>
      <div className="login-container">
        <img src={Logo} alt="Logotipo" className="login-logo" />
        <div className="login-form">
          <Form onSubmit={handleSubmit}>
            <h2>Iniciar sesión</h2>
            <FormField>
              <label>Usuario</label>
              <input
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormField>
            <FormField>
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormField>
            <Button type="submit" className="login-button">
              Entrar
            </Button>
            <span>
              O{" "}
              <a className="register-button" onClick={handleRegister}>
                Registrarse
              </a>
            </span>
          </Form>
        </div>
      </div>
    </>
  );
}