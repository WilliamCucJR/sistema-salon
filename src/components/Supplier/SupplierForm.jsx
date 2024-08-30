import { useState, useEffect } from "react";
import { FormField, Button, Form } from "semantic-ui-react";

const SupplierForm = ({
  selectedItem,
  closeModal,
  onFormSubmit,
  catalogueType,
}) => {
  const urlBase = import.meta.env.VITE_DEVELOP_URL_API;

  const [formData, setFormData] = useState({
    SUP_ID: "",
    SUP_NIT: "",
    SUP_SOCIAL_NAME: "",
    SUP_NAME: "",
    SUP_FIRST_LINE: "",
    SUP_SECOND_LINE: "",
    SUP_RESIDENTIARY: "",
    SUP_AVENUE: "",
    SUP_ZONE: "",
    SUP_CITY: "",
    SUP_STATE: "",
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
        SUP_ID: transformedData.SUP_ID || "",
        SUP_NIT: transformedData.SUP_NIT || "",
        SUP_SOCIAL_NAME: transformedData.SUP_SOCIAL_NAME || "",
        SUP_NAME: transformedData.SUP_NAME || "",
        SUP_FIRST_LINE: transformedData.SUP_FIRST_LINE || "",
        SUP_SECOND_LINE: transformedData.SUP_SECOND_LINE || "",
        SUP_RESIDENTIARY: transformedData.SUP_RESIDENTIARY || "",
        SUP_AVENUE: transformedData.SUP_AVENUE || "",
        SUP_ZONE: transformedData.SUP_ZONE || "",
        SUP_CITY: transformedData.SUP_CITY || "",
        SUP_STATE: transformedData.SUP_STATE || "",
      });
    }
  }, [selectedItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = formData.SUP_ID ? "PUT" : "POST";
    const url = formData.SUP_ID
      ? `${urlBase}${catalogueType}/${formData.SUP_ID}`
      : `${urlBase}${catalogueType}`;

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        SUP_NIT: formData.SUP_NIT,
        SUP_SOCIAL_NAME: formData.SUP_SOCIAL_NAME,
        SUP_NAME: formData.SUP_NAME,
        SUP_FIRST_LINE: formData.SUP_FIRST_LINE,
        SUP_SECOND_LINE: formData.SUP_SECOND_LINE,
        SUP_RESIDENTIARY: formData.SUP_RESIDENTIARY,
        SUP_AVENUE: formData.SUP_AVENUE,
        SUP_ZONE: formData.SUP_ZONE,
        SUP_CITY: formData.SUP_CITY,
        SUP_STATE: formData.SUP_STATE,
      }),
    });

    if (response.ok) {
      console.log("Registro guardado correctamente");

      alert("Formulario enviado exitosamente");
      onFormSubmit();
      closeModal();
    } else {
      alert("Error al enviar el formulario");
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
              name="SUP_ID"
              placeholder="ID"
              value={formData.SUP_ID}
              onChange={handleChange}
              readOnly
            />
          </FormField>
          <FormField>
            <label>NIT</label>
            <input
              type="text"
              name="SUP_NIT"
              placeholder="NIT"
              value={formData.SUP_NIT}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Nombre Social</label>
            <input
              type="text"
              name="SUP_SOCIAL_NAME"
              placeholder="Nombre Social"
              value={formData.SUP_SOCIAL_NAME}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Nombre</label>
            <input
              type="text"
              name="SUP_NAME"
              placeholder="Nombre"
              value={formData.SUP_NAME}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Primera Linea</label>
            <input
              type="text"
              name="SUP_FIRST_LINE"
              placeholder="Primera Linea"
              value={formData.SUP_FIRST_LINE}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Segunda Linea</label>
            <input
              type="text"
              name="SUP_SECOND_LINE"
              placeholder="Segunda Linea"
              value={formData.SUP_SECOND_LINE}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Residencial</label>
            <input
              type="text"
              name="SUP_RESIDENTIARY"
              placeholder="Residencial"
              value={formData.SUP_RESIDENTIARY}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Avenida</label>
            <input
              type="text"
              name="SUP_AVENUE"
              placeholder="Avenida"
              value={formData.SUP_AVENUE}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Zona</label>
            <input
              type="number"
              name="SUP_ZONE"
              placeholder="Zona"
              value={formData.SUP_ZONE}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Ciudad</label>
            <input
              type="text"
              name="SUP_CITY"
              placeholder="Ciudad"
              value={formData.SUP_CITY}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Estado</label>
            <input
              type="text"
              name="SUP_STATE"
              placeholder="Estado"
              value={formData.SUP_STATE}
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

export default SupplierForm;
