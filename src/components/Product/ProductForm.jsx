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

const ProductForm = ({
  selectedItem,
  closeModal,
  onFormSubmit,
  catalogueType,
}) => {
  const urlBase = import.meta.env.VITE_DEVELOP_URL_API;
  const urlFile = import.meta.env.VITE_DEVELOP_URL_FILE;
  let previewFile = ''
  const previewImg = 'uploads/img_preview.png'

  // Buscar el objeto que contiene PRO_IMAGEN
  const imagenObj = selectedItem.find(item => item.PRO_IMAGEN);
  const imagenPath = imagenObj ? imagenObj.PRO_IMAGEN : null;

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

  console.log(selectedItem);

   const measurementOptions = [
    { key: "1", text: "Unidad", value: "Unidad" },
    { key: "2", text: "Docena", value: "Docena" },
    { key: "3", text: "Pack", value: "Pack" },
  ];
  
   const unitOptions = [
    { key: "1", text: "Unidad", value: "Unidad" },
    { key: "2", text: "Mililitros (ml)", value: "Mililitros (ml)" },
    { key: "3", text: "Litros (L)", value: "Litros (L)" },
  ];

  const formScrollableDiv = {
    height: "400px",
    overflowY: "hidden",
    marginBottom: "20px",
  };

  const [formData, setFormData] = useState({
    PRO_ID: "",
    SUP_ID: "",
    PRO_NAME: "",
    PRO_MEASUREMENT: "",
    PRO_QUANTITY: "",
    PRO_UNIT: "",
    PRO_STOCK: "",
    PRO_VALUE: "",
    PRO_DESCRIPTION: "",
    PRO_IMAGEN: "",
  });

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
        PRO_UNIT: transformedData.PRO_UNIT || "",
        PRO_STOCK: transformedData.PRO_STOCK || "",
        PRO_VALUE: transformedData.PRO_VALUE || "",
        PRO_DESCRIPTION: transformedData.PRO_DESCRIPTION || "",
        PRO_IMAGEN: transformedData.PRO_IMAGEN || "",
      });
    }
  }, [selectedItem]);

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Mapeo de nombres de campos a textos de labels
    const fieldLabels = {
      SUP_ID: "ID Proveedor",
      PRO_NAME: "Nombre Producto",
      PRO_MEASUREMENT: "Presentación",
      PRO_QUANTITY: "Cantidad",
      PRO_UNIT: "Unidad Medida",
      PRO_STOCK: "Stock",
      PRO_VALUE: "Valor",
      PRO_DESCRIPTION: "Descripción",
      PRO_IMAGEN: "Imagen",
    };
  
    // Validación de campos requeridos
    const requiredFields = [
      "SUP_ID",
      "PRO_NAME",
      "PRO_MEASUREMENT",
      "PRO_QUANTITY",
      "PRO_UNIT",
      "PRO_STOCK",
      "PRO_VALUE",
      "PRO_DESCRIPTION",
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
  
  
    // Lógica para enviar los datos al API
    const method = formData.PRO_ID ? "PUT" : "POST";
    const url = formData.PRO_ID
      ? `${urlBase}${catalogueType}/${formData.PRO_ID}`
      : `${urlBase}${catalogueType}`;
  
    const formDataToSend = new FormData();
    formDataToSend.append("SUP_ID", formData.SUP_ID);
    formDataToSend.append("PRO_NAME", formData.PRO_NAME);
    formDataToSend.append("PRO_MEASUREMENT", formData.PRO_MEASUREMENT);
    formDataToSend.append("PRO_QUANTITY", formData.PRO_QUANTITY);
    formDataToSend.append("PRO_UNIT", formData.PRO_UNIT);
    formDataToSend.append("PRO_STOCK", formData.PRO_STOCK);
    formDataToSend.append("PRO_VALUE", formData.PRO_VALUE);
    formDataToSend.append("PRO_DESCRIPTION", formData.PRO_DESCRIPTION);
  
    if (selectedFile) {
      formDataToSend.append("PRO_IMAGEN", selectedFile);
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
            {formData.PRO_ID && (
              <FormInput
                fluid
                label="ID"
                type="text"
                name="PRO_ID"
                placeholder="ID"
                value={formData.PRO_ID}
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
              name="PRO_IMAGEN"
              placeholder="Imagen"
              value={formData.PRO_IMAGEN}
              onChange={handleChange}
              readOnly
            />
          </FormGroup>
          <Form>
            <FormGroup widths="equal">
              <FormInput
                fluid
                label="ID Proveedor"
                type="number"
                name="SUP_ID"
                placeholder="ID Proveedor"
                value={formData.SUP_ID}
                onChange={handleChange}
                min={1}
              />
              <FormInput
                fluid
                label="Nombre Producto"
                type="text"
                name="PRO_NAME"
                placeholder="Nombre Producto"
                value={formData.PRO_NAME}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup widths="equal">
            <FormField
                control={Select}
                fluid
                label="Presentación"
                name="PRO_MEASUREMENT"
                placeholder="Selecciona presentación"
                options={measurementOptions}
                value={formData.PRO_MEASUREMENT}
                onChange={(e, { value }) =>
                  setFormData({ ...formData, PRO_MEASUREMENT: value })
                }
              />
              <FormInput
                fluid
                label="Contenido"
                type="number"
                name="PRO_QUANTITY"
                placeholder="Contenido"
                value={formData.PRO_QUANTITY}
                onChange={handleChange}
                min={1}
              />
            </FormGroup>
            <FormGroup>
            <FormField
                control={Select}
                fluid
                label="Unidad de medida"
                name="PRO_UNIT"
                placeholder="Selecciona Medida"
                options={unitOptions}
                value={formData.PRO_UNIT}
                onChange={(e, { value }) =>
                  setFormData({ ...formData, PRO_UNIT: value })
                }
                width={7}
              />
              <FormInput
                fluid
                label="Stock"
                type="number"
                name="PRO_STOCK"
                placeholder="Stock"
                value={formData.PRO_STOCK}
                onChange={handleChange}
                width={5}
                min={0}
              />
              <FormInput
                fluid
                label="Valor (Q)"
                type="number"
                name="PRO_VALUE"
                placeholder="Valor (Q)"
                value={formData.PRO_VALUE}
                onChange={handleChange}
                width={5}
                min={0}
              />
              </FormGroup>
              <FormGroup>
              <FormInput
                fluid
                label="Descripción"
                type="text"
                name="PRO_DESCRIPTION"
                placeholder="Descripción"
                value={formData.PRO_DESCRIPTION}
                onChange={handleChange}
                width={16}
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

export default ProductForm; 

