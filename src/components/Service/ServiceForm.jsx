import { useState, useEffect } from "react";
import { FormField, Button, Form } from "semantic-ui-react";
import Swal from 'sweetalert2';

const ServiceForm = ({ selectedItem, closeModal, onFormSubmit, catalogueType }) => {
  const urlBase = import.meta.env.VITE_DEVELOP_URL_API;

  console.log(selectedItem);

  const [formData, setFormData] = useState({
    SER_ID: "",
    SER_SERVICENAME: "",
    SER_VALUE: "",
  });

  const buttonSaveStyle = {
    backgroundColor: "#dbac9a",
    border: "1px solid #dbac9a",
    color: "white",
  };

  const buttonCancelStyle = {
    backgroundColor: "#fff",
    color: "#9eb5b0",
    border: "1px solid #9eb5b0",
  };

  const formScrollableDiv = {
    height: "400px",
    overflowY: "scroll",
    marginBottom: "20px",
  };

  useEffect(() => {
    if (selectedItem) {
        
        const transformedData = selectedItem.reduce((acc, curr) => {
        const key = Object.keys(curr)[0];
        acc[key] = curr[key];
        return acc;
      }, {});

      setFormData({
        SER_ID: transformedData.SER_ID || "",
        SER_SERVICENAME: transformedData.SER_SERVICENAME || "",
        SER_VALUE: transformedData.SER_VALUE || "",
      });
    }
  }, [selectedItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = formData.SER_ID ? "PUT" : "POST";
    const url = formData.SER_ID
      ? `${urlBase}${catalogueType}/${formData.SER_ID}`
      : `${urlBase}${catalogueType}`;

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        SER_SERVICENAME: formData.SER_SERVICENAME,
        SER_VALUE: formData.SER_VALUE,
      }),
    });

    if (response.ok) {
      console.log("Registro guardado correctamente");

      Swal.fire({
        title: "Guardado",
        text: "Registro enviado exitosamente!",
        icon: "success"
      });
      onFormSubmit();
      closeModal();
    } else {
        Swal.fire({
            title: "Oops...",
            text: "Algo ha salido mal, intenta de nuevo!",
            icon: "error"
          });
      console.error("Error al enviar el formulario");
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <div style={formScrollableDiv}>
          <FormField>
            <label>ID</label>
            <input
              type="number"
              name="SER_ID"
              placeholder="ID"
              value={formData.SER_ID}
              onChange={handleChange}
              readOnly
            />
          </FormField>
          <FormField>
            <label>Nombre del Servicio</label>
            <input
              type="TEXT"
              name="SER_SERVICENAME"
              placeholder="SERVICE NAME"
              value={formData.SER_SERVICENAME}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Valor del Servicio</label>
          <input
            type="number"
            step="0.01"
            name="SER_VALUE"
            placeholder="Valor del Servicio"
            value={formData.SER_VALUE}
            onChange={handleChange}
            required
            />
          </FormField>
        </div>
        <Button type="submit" style={buttonSaveStyle}>
          Guardar
        </Button>
        <Button onClick={closeModal} style={buttonCancelStyle}>
          Cerrar
        </Button>
      </Form>
    </>
  );
};

export default ServiceForm;
