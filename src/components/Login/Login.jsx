import { FormField, Button, Form } from "semantic-ui-react";
import Logo from "../../assets/logo-sistema.png";
import "./Login.css";

export default function Login() {
  const handleRegister = () => {
    console.log("Register");
  };

  return (
    <>
      <div className="login-container">
        <img src={Logo} alt="Logotipo" className="login-logo" />
        <div className="login-form">
          <Form>
            <h2>Iniciar sesión</h2>
            <FormField>
              <label>Usuario</label>
              <input placeholder="Usuario" />
            </FormField>
            <FormField>
              <label>Contraseña</label>
              <input type="password" placeholder="Contraseña" />
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
