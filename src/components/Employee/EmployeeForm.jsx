import { useState, useEffect } from "react";
import { FormField, Button, Form } from "semantic-ui-react";
import Swal from 'sweetalert2';

const EmployeeForm = ({
  selectedItem,
  closeModal,
  onFormSubmit,
  catalogueType,
}) => {
  const urlBase = import.meta.env.VITE_DEVELOP_URL_API;

  selectedItem.forEach((employee) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    };

    if (employee.EMP_HIREDATE) {
      employee.EMP_HIREDATE = formatDate(employee.EMP_HIREDATE);
    }
    // Agrega más campos de fecha si es necesario
    
  });

  console.log(selectedItem);

  const [formData, setFormData] = useState({
    EMP_ID: "",
    USE_ID: "",
    EMP_EMAIL: "",
    EMP_HIREDATE: "",
    EMP_FIRST_NAME: "",
    EMP_MIDDLE_NAME: "",
    EMP_LAST_NAME: "",
    EMP_SECONDLAST_NAME: "",
    EMP_FIRST_LINE: "",
    EMP_SECOND_LINE: "",
    EMP_RESIDENTIARY: "",
    EMP_AVENUE: "",
    EMP_ZONE: "",
    EMP_CITY: "",
    EMP_STATE: "",
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
        EMP_ID: transformedData.EMP_ID || "",
        USE_ID: transformedData.USE_ID || "",
        EMP_EMAIL: transformedData.EMP_EMAIL || "",
        EMP_HIREDATE: transformedData.EMP_HIREDATE || "",
        EMP_FIRST_NAME: transformedData.EMP_FIRST_NAME || "",
        EMP_MIDDLE_NAME: transformedData.EMP_MIDDLE_NAME || "",
        EMP_LAST_NAME: transformedData.EMP_LAST_NAME || "",
        EMP_SECONDLAST_NAME: transformedData.EMP_SECONDLAST_NAME || "",
        EMP_FIRST_LINE: transformedData.EMP_FIRST_LINE || "",
        EMP_SECOND_LINE: transformedData.EMP_SECOND_LINE || "",
        EMP_RESIDENTIARY: transformedData.EMP_RESIDENTIARY || "",
        EMP_AVENUE: transformedData.EMP_AVENUE || "",
        EMP_ZONE: transformedData.EMP_ZONE || "",
        EMP_CITY: transformedData.EMP_CITY || "",
        EMP_STATE: transformedData.EMP_STATE || "",
      });
    }
  }, [selectedItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = formData.EMP_ID ? "PUT" : "POST";
    const url = formData.EMP_ID
      ? `${urlBase}${catalogueType}/${formData.EMP_ID}`
      : `${urlBase}${catalogueType}`;

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        USE_ID: formData.USE_ID,
        EMP_EMAIL: formData.EMP_EMAIL,
        EMP_HIREDATE: formData.EMP_HIREDATE,
        EMP_FIRST_NAME: formData.EMP_FIRST_NAME,
        EMP_MIDDLE_NAME: formData.EMP_MIDDLE_NAME,
        EMP_LAST_NAME: formData.EMP_LAST_NAME,
        EMP_SECONDLAST_NAME: formData.EMP_SECONDLAST_NAME,
        EMP_FIRST_LINE: formData.EMP_FIRST_LINE,
        EMP_SECOND_LINE: formData.EMP_SECOND_LINE,
        EMP_RESIDENTIARY: formData.EMP_RESIDENTIARY,
        EMP_AVENUE: formData.EMP_AVENUE,
        EMP_ZONE: formData.EMP_ZONE,
        EMP_CITY: formData.EMP_CITY,
        EMP_STATE: formData.EMP_STATE,
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
              name="EMP_ID"
              placeholder="ID"
              value={formData.EMP_ID}
              onChange={handleChange}
              readOnly
            />
          </FormField>
          <FormField>
            <label>Usuario ID</label>
            <input
              type="number"
              name="USE_ID"
              placeholder="Usuario ID"
              value={formData.USE_ID}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Email</label>
            <input
              type="email"
              name="EMP_EMAIL"
              placeholder="Email"
              value={formData.EMP_EMAIL}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Fecha de Contratación</label>
            <input
              type="date"
              name="EMP_HIREDATE"
              placeholder="Fecha de Contratación"
              value={formData.EMP_HIREDATE}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Primer Nombre</label>
            <input
              type="text"
              name="EMP_FIRST_NAME"
              placeholder="Primer Nombre"
              value={formData.EMP_FIRST_NAME}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Segundo Nombre</label>
            <input
              type="text"
              name="EMP_MIDDLE_NAME"
              placeholder="Segundo Nombre"
              value={formData.EMP_MIDDLE_NAME}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <label>Primer Apellido</label>
            <input
              type="text"
              name="EMP_LAST_NAME"
              placeholder="Primer Apellido"
              value={formData.EMP_LAST_NAME}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Segundo Apellido</label>
            <input
              type="text"
              name="EMP_SECONDLAST_NAME"
              placeholder="Segundo Apellido"
              value={formData.EMP_SECONDLAST_NAME}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <label>Primera Linea</label>
            <input
              type="text"
              name="EMP_FIRST_LINE"
              placeholder="Primera Linea"
              value={formData.EMP_FIRST_LINE}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Segunda Linea</label>
            <input
              type="text"
              name="EMP_SECOND_LINE"
              placeholder="Segunda Linea"
              value={formData.EMP_SECOND_LINE}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Residencial</label>
            <input
              type="text"
              name="EMP_RESIDENTIARY"
              placeholder="Residencial"
              value={formData.EMP_RESIDENTIARY}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Avenida</label>
            <input
              type="text"
              name="EMP_AVENUE"
              placeholder="Avenida"
              value={formData.EMP_AVENUE}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Zona</label>
            <input
              type="number"
              name="EMP_ZONE"
              placeholder="Zona"
              value={formData.EMP_ZONE}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Ciudad</label>
            <input
              type="text"
              name="EMP_CITY"
              placeholder="Ciudad"
              value={formData.EMP_CITY}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField>
            <label>Estado</label>
            <input
              type="text"
              name="EMP_STATE"
              placeholder="Estado"
              value={formData.EMP_STATE}
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

export default EmployeeForm;
