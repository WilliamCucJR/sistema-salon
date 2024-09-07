import { useState, useEffect } from "react";
import {
  FormField,
  Button,
  Form,
  Tab,
  FormGroup,
  FormInput,
  Select,
  Icon,
} from "semantic-ui-react";
import Swal from "sweetalert2";
import FileInput from '../FileInput/FileInput';

const CustomerForm = ({
  selectedItem,
  closeModal,
  onFormSubmit,
  catalogueType,
}) => {
  const urlBase = import.meta.env.VITE_DEVELOP_URL_API;
  const urlFile = import.meta.env.VITE_DEVELOP_URL_FILE;
  let previewFile = ''
  const previewImg = 'uploads/img_preview.png'

  // Buscar el objeto que contiene CUS_IMAGEN
  const imagenObj = selectedItem.find(item => item.CUS_IMAGEN);
  const imagenPath = imagenObj ? imagenObj.CUS_IMAGEN : null;

  if (imagenPath) {
    previewFile = `${urlFile}${imagenPath}`;
  } else {
    previewFile = `${urlFile}${previewImg}`;
  }

  console.log(selectedItem);
  console.log(previewFile);

  selectedItem.forEach((customer) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    };


    if (customer.CUS_DATE_OF_BIRTH) {
        customer.CUS_DATE_OF_BIRTH = formatDate(customer.CUS_DATE_OF_BIRTH);
    }
    // Agrega más campos de fecha si es necesario
  });

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

    const [selectedFile, setSelectedFile] = useState(null); // Estado para el archivo seleccionado

  const genderOptions = [
    { key: "m", text: "Masculino", value: "Masculino" },
    { key: "f", text: "Femenino", value: "Femenino" },
  ];

  console.log(selectedItem);


  const formScrollableDiv = {
    height: "400px",
    overflowY: "hidden",
    marginBottom: "20px",
  };

  const [formData, setFormData] = useState({
    CUS_ID: "",
    USE_ID: "",
    CUS_EMAIL: "",
    CUS_FIRST_NAME: "",
    CUS_MIDDLE_NAME: "",
    CUS_LAST_NAME: "",
    CUS_SECONDLAST_NAME: "",
    CUS_AFFILIATE: "",
    CUS_GENDER: "",
    CUS_CELLPHONE: "",
    CUS_NIT: "",
    CUS_DATE_OF_BIRTH: "",
    CUS_IMAGEN: "",
  });

  useEffect(() => {
    if (selectedItem) {
      const transformedData = selectedItem.reduce((acc, curr) => {
        const key = Object.keys(curr)[0];
        acc[key] = curr[key];
        return acc;
      }, {});

      setFormData({
        CUS_ID: transformedData.CUS_ID || "",
        USE_ID: transformedData.USE_ID || null,
        CUS_EMAIL: transformedData.CUS_EMAIL || "",
        CUS_FIRST_NAME: transformedData.CUS_FIRST_NAME || "",
        CUS_MIDDLE_NAME: transformedData.CUS_MIDDLE_NAME || "",
        CUS_LAST_NAME: transformedData.CUS_LAST_NAME || "",
        CUS_SECONDLAST_NAME: transformedData.CUS_SECONDLAST_NAME || "",
        CUS_GENDER: transformedData.CUS_GENDER || "",
        CUS_CELLPHONE: transformedData.CUS_CELLPHONE || "",
        CUS_NIT: transformedData.CUS_NIT || "",
        CUS_DATE_OF_BIRTH: transformedData.CUS_DATE_OF_BIRTH || "",
        CUS_IMAGEN: transformedData.CUS_IMAGEN || "",
        CUS_AFFILIATE: transformedData.CUS_AFFILIATE || "",
        
      });

    
    }
  }, [selectedItem]);

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit ejecutado");

    // Mapeo de nombres de campos a textos de labels
    const fieldLabels = {
      CUS_EMAIL: "Correo",
      CUS_FIRST_NAME: "Primer Nombre",
      CUS_MIDDLE_NAME: "Segundo Nombre",
      CUS_LAST_NAME: "Primer Apellido",
      CUS_SECONDLAST_NAME: "Segundo Apellido",
      CUS_GENDER: "Género",
      CUS_CELLPHONE: "Teléfono",
      CUS_NIT: "NIT",
      CUS_DATE_OF_BIRTH: "Fecha de nacimiento",
      CUS_IMAGEN: "Imagen",
      CUS_AFFILIATE: "Afiliacion",

    };
 // Validación de campos requeridos
 const requiredFields = [
    "CUS_EMAIL",
    "CUS_FIRST_NAME",
    "CUS_MIDDLE_NAME",
    "CUS_LAST_NAME",
    "CUS_SECONDLAST_NAME",
    "CUS_GENDER",
    "CUS_CELLPHONE",
    "CUS_NIT",
    "CUS_DATE_OF_BIRTH",
    "CUS_AFFILIATE",
  ];

  const missingFields = requiredFields.filter(
    (field) => !formData[field]
  );

  if (missingFields.length > 0) {
    const missingFieldLabels = missingFields.map(
      (field) => fieldLabels[field]
    );
    Swal.fire({
      title: "Error",
      text: `Por favor complete los siguientes campos: ${missingFieldLabels.join(", ")}`,
      icon: "error",
    });
    return;
  }
 // Validación de formato de correo electrónico
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 if (!emailRegex.test(formData.CUS_EMAIL)) {
   Swal.fire({
     title: "Error",
     text: "Por favor ingrese un correo electrónico válido.",
     icon: "error",
   });
   return;
 }

  // Lógica para enviar los datos al API
  const method = formData.CUS_ID ? "PUT" : "POST";
  const url = formData.CUS_ID
    ? `${urlBase}${catalogueType}/${formData.CUS_ID}`
    : `${urlBase}${catalogueType}`;

  const formDataToSend = new FormData();
  formDataToSend.append("CUS_EMAIL", formData.CUS_EMAIL);
  formDataToSend.append("CUS_FIRST_NAME", formData.CUS_FIRST_NAME);
  formDataToSend.append("CUS_MIDDLE_NAME", formData.CUS_MIDDLE_NAME);
  formDataToSend.append("CUS_LAST_NAME", formData.CUS_LAST_NAME);
  formDataToSend.append("CUS_SECONDLAST_NAME", formData.CUS_SECONDLAST_NAME);
  formDataToSend.append("CUS_GENDER", formData.CUS_GENDER);
  formDataToSend.append("CUS_CELLPHONE", formData.CUS_CELLPHONE);
  formDataToSend.append("CUS_NIT", formData.CUS_NIT);
  formDataToSend.append("CUS_DATE_OF_BIRTH", formData.CUS_DATE_OF_BIRTH);
  formDataToSend.append("CUS_AFFILIATE", formData.CUS_AFFILIATE);

  if (selectedFile) {
   formDataToSend.append("CUS_IMAGEN", selectedFile);
  }

  const response = await fetch(url, {
    method: method,
    body: formDataToSend,
  });

  if (response.ok) {
    console.log("Registro guardado correctamente");

    Swal.fire({
      title: "Guardado",
      text: "Registro enviado exitosamente!",
      icon: "success",
    });
    onFormSubmit();
    closeModal();
  } else {
    Swal.fire({
      title: "Oops...",
      text: "Algo ha salido mal, intenta de nuevo!",
      icon: "error",
    });
    console.error("Error al enviar el formulario");
  }
};
  const panes = [
    {
      menuItem: "Datos Generales",
      render: () => (
        <Tab.Pane>
          <FormGroup>
            {formData.CUS_ID && (
              <FormInput
                fluid
                label="ID"
                type="text"
                name="CUS_ID"
                placeholder="ID"
                value={formData.CUS_ID}
                onChange={handleChange}
                readOnly
                width={8}
              />
            )}
          </FormGroup>
          <FormGroup widths="equal" style={{ display: "none" }}>
            <FormInput
              fluid
              label="IMAGEN"
              name="CUS_IMAGEN"
              placeholder="Imagen"
              value={formData.CUS_IMAGEN}
              onChange={handleChange}
              readOnly
            />
          </FormGroup>
          <FormGroup widths="equal" style={{ display: "none" }}>
            <FormInput
              fluid
              label="ID USUARIO"
              name="USE_ID"
              placeholder="Usuario ID"
              value={formData.USE_ID}
              onChange={handleChange}
            />
          </FormGroup>
          <Form>
            <FormGroup widths="equal">
              <FormInput
                fluid
                label="Primer Nombre"
                type="text"
                name="CUS_FIRST_NAME"
                placeholder="Primer Nombre"
                value={formData.CUS_FIRST_NAME}
                onChange={handleChange}
              />
              <FormInput
                fluid
                label="Segundo Nombre"
                type="text"
                name="CUS_MIDDLE_NAME"
                placeholder="Segundo Nombre"
                value={formData.CUS_MIDDLE_NAME}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup widths="equal">
              <FormInput
                fluid
                label="Primer Apellido"
                type="text"
                name="CUS_LAST_NAME"
                placeholder="Primer Apellido"
                value={formData.CUS_LAST_NAME}
                onChange={handleChange}
              />
              <FormInput
                fluid
                label="Segundo Apellido"
                type="text"
                name="CUS_SECONDLAST_NAME"
                placeholder="Segundo Apellido"
                value={formData.CUS_SECONDLAST_NAME}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <FormInput
                fluid
                label="Correo"
                type="email"
                name="CUS_EMAIL"
                placeholder="Correo"
                value={formData.CUS_EMAIL}
                onChange={handleChange}
                width={6}
              />
              <FormInput
                fluid
                label="Teléfono"
                type="text"
                name="CUS_CELLPHONE"
                placeholder="Teléfono"
                value={formData.CUS_CELLPHONE}
                onChange={(e, { value }) => {
                  if (/^\d{0,8}$/.test(value)) {
                    handleChange(e, { name: "CUS_CELLPHONE", value });
                  }
                }}
                width={6}
              />
              <FormInput
                fluid
                label="NIT"
                type="text"
                name="CUS_NIT"
                placeholder="NIT"
                value={formData.CUS_NIT}
                onChange={(e) => {
                  const { value } = e.target;
                  if (/^[a-zA-Z0-9]{0,10}$/.test(value)) {
                    handleChange(e, { name: "CUS_NIT", value });
                  }
                }}
                width={6}
              />
            </FormGroup>
            <FormGroup>
              <FormField
                control={Select}
                fluid
                label="Género"
                name="CUS_GENDER"
                placeholder="Selecciona Género"
                options={genderOptions}
                value={formData.CUS_GENDER}
                onChange={(e, { value }) =>
                  setFormData({ ...formData, CUS_GENDER: value })
                }
                width={6}
              />
              <FormInput
                fluid
                label="Fecha de nacimiento"
                type="date"
                name="CUS_DATE_OF_BIRTH"
                placeholder="Nacimiento"
                value={formData.EMP_DATE_OF_BIRTH}
                onChange={handleChange}
                width={6}
                max={maxDate} 
                onKeyDown={(e) => e.preventDefault()} 
                readOnly 
              />
              <FormInput
                fluid
                label="Numero de afiliación "
                type="text"
                name="CUS_AFFILIATE"
                placeholder="Afiliacion"
                value={formData.CUS_AFFILIATE}
                onChange={(e) => {
                const { value } = e.target;
                if (/^\d{0,10}$/.test(value)) {
                handleChange(e, { name: "CUS_AFFILIATE", value });
    }
  }}
  width={6}
/>

            </FormGroup>
          </Form>
        </Tab.Pane>
      ),
    },
    
    {
        menuItem: "Imagen",
        render: () => (
          <Tab.Pane>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FormField style={{ marginRight: '125px', marginLeft: '25px' }}>
              <img src={previewFile} alt="Preview" width={100} />
            </FormField>
            <FormField>
              <FileInput
                input={{
                  id: "input-file",
                }}
                onFileSelect={handleFileSelect}
              />
            </FormField>
          </div>
        </Tab.Pane>
        ),
      },
    ];

  return (
    <Form onSubmit={handleSubmit}>
      <div
        style={{
          ...formScrollableDiv,
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <Tab panes={panes} />
      </div>
      <Button type="submit" color="teal">
        <Icon name="save" /> Guardar
      </Button>
      <Button onClick={closeModal} inverted color='brown'>
        <Icon name="close" /> Cerrar
      </Button>
    </Form>
  );
};

export default CustomerForm;
