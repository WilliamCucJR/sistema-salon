import { FormField, Button, Form } from 'semantic-ui-react';
import { useState } from 'react';
import './SignUp.css';

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Datos de registro:', formData);
  };

  return (
    <div className="signup-container">
      <Form onSubmit={handleSubmit} className="signup-form">
        <h2 className="signup-title">Registrarse</h2>
        <FormField>
          <label>Correo Electrónico</label>
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={handleChange}
          />
        </FormField>
        <FormField>
          <label>Nombre</label>
          <input
            type="text"
            name="firstName"
            placeholder="Nombre"
            value={formData.firstName}
            onChange={handleChange}
          />
        </FormField>
        <FormField>
          <label>Apellido</label>
          <input
            type="text"
            name="lastName"
            placeholder="Apellido"
            value={formData.lastName}
            onChange={handleChange}
          />
        </FormField>
        <FormField>
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
          />
        </FormField>
        <Button type="submit" className="signup-button">
          Registrar
        </Button>
      </Form>
    </div>
  );
}