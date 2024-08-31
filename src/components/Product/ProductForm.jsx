import { useState, useEffect } from "react";
import { FormField, Button, Form } from "semantic-ui-react";
import Swal from 'sweetalert2';

const ProductForm = ({
  selectedItem,
  closeModal,
  onFormSubmit,
  catalogueType,
}) => {
  const urlBase = import.meta.env.VITE_DEVELOP_URL_API;
  
  const [formData, setFormData] = useState({
    PRO_ID: "",
    SUP_ID: "",
    PRO_NAME: "",
    PRO_MEASUREMENT: "",
    PRO_QUANTITY: "",
    PRO_VALUE: "",
    PRO_DESCRIPTION: "",
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
        PRO_ID: transformedData.PRO_ID || "",
        SUP_ID: transformedData.SUP_ID || "",
        PRO_NAME: transformedData.PRO_NAME || "",
        PRO_MEASUREMENT: transformedData.PRO_MEASUREMENT || "",
        PRO_QUANTITY: transformedData.PRO_QUANTITY || "",
        PRO_VALUE: transformedData.PRO_VALUE || "",
        PRO_DESCRIPTION: transformedData.PRO_DESCRIPTION || "",
      });
    }
  }, [selectedItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = formData.PRO_ID ? "PUT" : "POST";
    const url = formData.PRO_ID
      ? `${urlBase}${catalogueType}/${formData.PRO_ID}`
      : `${urlBase}${catalogueType}`;

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        SUP_ID: formData.SUP_ID,
        PRO_NAME: formData.PRO_NAME,
        PRO_MEASUREMENT: formData.PRO_MEASUREMENT,
        PRO_QUANTITY: formData.PRO_QUANTITY,
        PRO_VALUE: formData.PRO_VALUE,
        PRO_DESCRIPTION: formData.PRO_DESCRIPTION,
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
              name="PRO_ID"
              placeholder="ID"
              value={formData.PRO_ID}
              onChange={handleChange}
              readOnly
            />
          </FormField>
          <FormField>
            <label>Proveedor ID</label>
            <input
              type="number"
              name="SUP_ID"
              placeholder="Proveedor ID"
              value={formData.SUP_ID}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Nombre</label>
            <input
              type="text"
              name="PRO_NAME"
              placeholder="Nombre"
              value={formData.PRO_NAME}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Medida</label>
            <input
              type="number"
              name="PRO_MEASUREMENT"
              placeholder="Medida"
              value={formData.PRO_MEASUREMENT}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Cantidad</label>
            <input
              type="number"
              name="PRO_QUANTITY"
              placeholder="Cantidad"
              value={formData.PRO_QUANTITY}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Valor</label>
            <input
              type="number"
              name="PRO_VALUE"
              placeholder="Valor"
              value={formData.PRO_VALUE}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <label>Descripción</label>
            <input
              type="text"
              name="PRO_DESCRIPTION"
              placeholder="Descripción"
              value={formData.PRO_DESCRIPTION}
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

export default ProductForm;
