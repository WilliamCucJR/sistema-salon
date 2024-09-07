import { useState, useEffect } from "react";
import {
  FormField,
  Button,
  Form,
  Tab,
  FormGroup,
  FormInput,
  Icon,
} from "semantic-ui-react";
import Swal from "sweetalert2";
import FileInput from '../FileInput/FileInput';

const ServiceForm = ({ 
  selectedItem, 
  closeModal, 
  onFormSubmit, 
  catalogueType }) => {
  const urlBase = import.meta.env.VITE_DEVELOP_URL_API;
  const urlFile = import.meta.env.VITE_DEVELOP_URL_FILE;
  let previewFile = ''
  const previewImg = 'uploads/img_preview.png'

  // Imagen

  const imagenObj = selectedItem.find(item => item.SER_IMAGEN);
  const imagenPath = imagenObj ? imagenObj.SER_IMAGEN : null;

  if (imagenPath) {
    previewFile = `${urlFile}${imagenPath}`;
  } else {
    previewFile = `${urlFile}${previewImg}`;
  }

  console.log(selectedItem);
  console.log(previewFile);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };
  const [selectedFile, setSelectedFile] = useState(null); // Estado para el archivo seleccionado
  const [formData, setFormData] = useState({
    SER_ID: "",
    SER_SERVICENAME: "",
    SER_VALUE: "",
    SER_IMAGEN:"",
  });

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
        SER_IMAGEN: transformedData.SER_IMAGEN || "",
      });
    }
  }, [selectedItem]);

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });

    if (name === "SER_VALUE" && value < 0) {
      Swal.fire({
        title: "Error",
        text: "El costo del servicio no puede ser menor a 0.",
        icon: "error",
      });
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
  const fieldLabels = {
      SER_SERVICENAME: "Servicio",
      SER_VALUE: "Costo del Servicio",
      SER_IMAGEN: "Imagen",
    };
  
    // Validación de campos requeridos
    const requiredFields = [
      "SER_SERVICENAME",
      "SER_VALUE",
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

    const method = formData.SER_ID ? "PUT" : "POST";
    const url = formData.SER_ID
      ? `${urlBase}${catalogueType}/${formData.SER_ID}`
      : `${urlBase}${catalogueType}`;

    const formDataToSend = new FormData();
    formDataToSend.append("SER_SERVICENAME", formData.SER_SERVICENAME);
    formDataToSend.append("SER_VALUE", formData.SER_VALUE);
  
    if (selectedFile) {
      formDataToSend.append("SER_IMAGEN", selectedFile);
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
      menuItem: "Datos del Servicio",
      render: () => (
        <Tab.Pane>
          <FormGroup>
            {formData.SER_ID && (
              <FormInput
                fluid
                label="ID"
                type="text"
                name="SER_ID"
                placeholder="ID"
                value={formData.SER_ID}
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
              name="SER_IMAGEN"
              placeholder="Imagen"
              value={formData.SER_IMAGEN}
              onChange={handleChange}
              readOnly
            />
          </FormGroup>
          <Form>
            <FormGroup widths="equal">
              <FormInput
                fluid
                label="Nombre del Servicio"
                type="text"
                name="SER_SERVICENAME"
                placeholder="Nombre del Servicio"
                value={formData.SER_SERVICENAME}
                onChange={handleChange}
              />
              <FormInput
                fluid
                label="Costo del Servicio"
                type="Number"
                name="SER_VALUE"
                placeholder="Costo del Servicio"
                value={formData.SER_VALUE}
                onChange={handleChange}
                width={4}
                min = {1}
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

export default ServiceForm;
