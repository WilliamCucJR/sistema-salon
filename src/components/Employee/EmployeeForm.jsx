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
import FileInput from "../FileInput/FileInput";
import guatemalaData from "../../data/guatemala.json";

const EmployeeForm = ({
  selectedItem,
  closeModal,
  onFormSubmit,
  catalogueType,
}) => {
  const urlBase = import.meta.env.VITE_DEVELOP_URL_API;
  const urlFile = import.meta.env.VITE_DEVELOP_URL_FILE;
  let previewFile = "";
  const previewImg = "uploads/img_preview.png";

  // Buscar el objeto que contiene EMP_IMAGEN
  const imagenObj = selectedItem.find((item) => item.EMP_IMAGEN);
  const imagenPath = imagenObj ? imagenObj.EMP_IMAGEN : null;

  if (imagenPath) {
    previewFile = `${urlFile}${imagenPath}`;
  } else {
    previewFile = `${urlFile}${previewImg}`;
  }

  console.log(selectedItem);

  console.log(previewFile);

  selectedItem.forEach((employee) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    };

    if (employee.EMP_HIREDATE) {
      employee.EMP_HIREDATE = formatDate(employee.EMP_HIREDATE);
    }

    if (employee.EMP_DATE_OF_BIRTH) {
      employee.EMP_DATE_OF_BIRTH = formatDate(employee.EMP_DATE_OF_BIRTH);
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

  const maxDateContrato = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 30
  );

  const minDateContrato = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const maxDateC = formatDate(maxDateContrato);
  const minDateC = formatDate(minDateContrato);

  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // Estado para el archivo seleccionado

  useEffect(() => {
    const departamentosOptions = Object.keys(guatemalaData).map(
      (departamento) => ({
        key: departamento,
        text: departamento,
        value: departamento,
      })
    );
    setDepartamentos(departamentosOptions);

    // Inicializar municipios con todos los municipios disponibles
    const allMunicipios = Object.values(guatemalaData)
      .flat()
      .map((municipio) => ({
        key: municipio,
        text: municipio,
        value: municipio,
      }));
    setMunicipios(allMunicipios);
  }, []);

  useEffect(() => {
    if (selectedItem && selectedItem.EMP_STATE) {
      setSelectedDepartamento(selectedItem.EMP_STATE);
      const municipiosOptions = guatemalaData[selectedItem.EMP_STATE].map(
        (municipio) => ({
          key: municipio,
          text: municipio,
          value: municipio,
        })
      );
      setMunicipios(municipiosOptions);
      if (selectedItem.EMP_CITY) {
        setSelectedMunicipio(selectedItem.EMP_CITY);
      }
    }
  }, [selectedItem]);

  const handleDepartamentoChange = (e, { value }) => {
    setSelectedDepartamento(value);
    const municipiosOptions = guatemalaData[value].map((municipio) => ({
      key: municipio,
      text: municipio,
      value: municipio,
    }));
    setMunicipios(municipiosOptions);
    setFormData({ ...formData, EMP_STATE: value, EMP_CITY: "" });
  };

  const handleMunicipioChange = (e, { value }) => {
    setSelectedMunicipio(value);
    setFormData({ ...formData, EMP_CITY: value });
  };

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
    EMP_ID: "",
    EMP_EMAIL: "",
    EMP_HIREDATE: "",
    EMP_FIRST_NAME: "",
    EMP_MIDDLE_NAME: "",
    EMP_LAST_NAME: "",
    EMP_GENDER: "",
    EMP_CELLPHONE: "",
    EMP_NIT: "",
    EMP_DATE_OF_BIRTH: "",
    EMP_SECONDLAST_NAME: "",
    EMP_FIRST_LINE: "",
    EMP_SECOND_LINE: "",
    EMP_RESIDENTIARY: "",
    EMP_AVENUE: "",
    EMP_ZONE: "",
    EMP_CITY: "",
    EMP_STATE: "",
    EMP_IMAGEN: "",
  });

  useEffect(() => {
    if (selectedItem) {
      const transformedData = selectedItem.reduce((acc, curr) => {
        const key = Object.keys(curr)[0];
        acc[key] = curr[key];
        return acc;
      }, {});

      setFormData({
        EMP_ID: transformedData.EMP_ID || "",
        EMP_EMAIL: transformedData.EMP_EMAIL || "",
        EMP_HIREDATE: transformedData.EMP_HIREDATE || "",
        EMP_FIRST_NAME: transformedData.EMP_FIRST_NAME || "",
        EMP_MIDDLE_NAME: transformedData.EMP_MIDDLE_NAME || "",
        EMP_LAST_NAME: transformedData.EMP_LAST_NAME || "",
        EMP_SECONDLAST_NAME: transformedData.EMP_SECONDLAST_NAME || "",
        EMP_GENDER: transformedData.EMP_GENDER || "",
        EMP_CELLPHONE: transformedData.EMP_CELLPHONE || "",
        EMP_NIT: transformedData.EMP_NIT || "",
        EMP_DATE_OF_BIRTH: transformedData.EMP_DATE_OF_BIRTH || "",
        EMP_FIRST_LINE: transformedData.EMP_FIRST_LINE || "",
        EMP_SECOND_LINE: transformedData.EMP_SECOND_LINE || "",
        EMP_RESIDENTIARY: transformedData.EMP_RESIDENTIARY || "",
        EMP_AVENUE: transformedData.EMP_AVENUE || "",
        EMP_ZONE: transformedData.EMP_ZONE || "",
        EMP_CITY: transformedData.EMP_CITY || "",
        EMP_STATE: transformedData.EMP_STATE || "",
        EMP_IMAGEN: transformedData.EMP_IMAGEN || "",
      });

      setSelectedDepartamento(transformedData.EMP_STATE || "");
      setSelectedMunicipio(transformedData.EMP_CITY || "");
    }
  }, [selectedItem]);

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mapeo de nombres de campos a textos de labels
    const fieldLabels = {
      EMP_EMAIL: "Correo",
      EMP_HIREDATE: "Fecha de contratación",
      EMP_FIRST_NAME: "Primer Nombre",
      EMP_MIDDLE_NAME: "Segundo Nombre",
      EMP_LAST_NAME: "Primer Apellido",
      EMP_SECONDLAST_NAME: "Segundo Apellido",
      EMP_GENDER: "Género",
      EMP_CELLPHONE: "Teléfono",
      EMP_NIT: "NIT",
      EMP_DATE_OF_BIRTH: "Fecha de nacimiento",
      EMP_FIRST_LINE: "Primera Linea",
      EMP_SECOND_LINE: "Segunda Linea",
      EMP_RESIDENTIARY: "Residencial",
      EMP_AVENUE: "Avenida",
      EMP_ZONE: "Zona",
      EMP_CITY: "Municipio",
      EMP_STATE: "Departamento",
      EMP_IMAGEN: "Imagen",
    };

    // Validación de campos requeridos
    const requiredFields = [
      "EMP_EMAIL",
      "EMP_HIREDATE",
      "EMP_FIRST_NAME",
      "EMP_MIDDLE_NAME",
      "EMP_LAST_NAME",
      "EMP_SECONDLAST_NAME",
      "EMP_GENDER",
      "EMP_CELLPHONE",
      "EMP_NIT",
      "EMP_DATE_OF_BIRTH",
      "EMP_FIRST_LINE",
      "EMP_SECOND_LINE",
      "EMP_RESIDENTIARY",
      "EMP_AVENUE",
      "EMP_ZONE",
      "EMP_CITY",
      "EMP_STATE",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      const missingFieldLabels = missingFields.map(
        (field) => fieldLabels[field]
      );
      Swal.fire({
        title: "Error",
        text: `Por favor complete los siguientes campos: ${missingFieldLabels.join(
          ", "
        )}`,
        icon: "error",
      });
      return;
    }

    // Validación de formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.EMP_EMAIL)) {
      Swal.fire({
        title: "Error",
        text: "Por favor ingrese un correo electrónico válido.",
        icon: "error",
      });
      return;
    }

    // Lógica para enviar los datos al API
    const method = formData.EMP_ID ? "PUT" : "POST";
    const url = formData.EMP_ID
      ? `${urlBase}${catalogueType}/${formData.EMP_ID}`
      : `${urlBase}${catalogueType}`;

    const formDataToSend = new FormData();
    formDataToSend.append("EMP_EMAIL", formData.EMP_EMAIL);
    formDataToSend.append("EMP_HIREDATE", formData.EMP_HIREDATE);
    formDataToSend.append("EMP_FIRST_NAME", formData.EMP_FIRST_NAME);
    formDataToSend.append("EMP_MIDDLE_NAME", formData.EMP_MIDDLE_NAME);
    formDataToSend.append("EMP_LAST_NAME", formData.EMP_LAST_NAME);
    formDataToSend.append("EMP_SECONDLAST_NAME", formData.EMP_SECONDLAST_NAME);
    formDataToSend.append("EMP_GENDER", formData.EMP_GENDER);
    formDataToSend.append("EMP_CELLPHONE", formData.EMP_CELLPHONE);
    formDataToSend.append("EMP_NIT", formData.EMP_NIT);
    formDataToSend.append("EMP_DATE_OF_BIRTH", formData.EMP_DATE_OF_BIRTH);
    formDataToSend.append("EMP_FIRST_LINE", formData.EMP_FIRST_LINE);
    formDataToSend.append("EMP_SECOND_LINE", formData.EMP_SECOND_LINE);
    formDataToSend.append("EMP_RESIDENTIARY", formData.EMP_RESIDENTIARY);
    formDataToSend.append("EMP_AVENUE", formData.EMP_AVENUE);
    formDataToSend.append("EMP_ZONE", formData.EMP_ZONE);
    formDataToSend.append("EMP_CITY", formData.EMP_CITY);
    formDataToSend.append("EMP_STATE", formData.EMP_STATE);

    if (selectedFile) {
      formDataToSend.append("EMP_IMAGEN", selectedFile);
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
            {formData.EMP_ID && (
              <FormInput
                fluid
                label="ID"
                type="text"
                name="EMP_ID"
                placeholder="ID"
                value={formData.EMP_ID}
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
              name="EMP_IMAGEN"
              placeholder="Imagen"
              value={formData.EMP_IMAGEN}
              onChange={handleChange}
              readOnly
            />
          </FormGroup>
          <Form>
            <FormGroup widths="equal">
              <FormInput
                fluid
                label="Primer Nombre"
                type="text"
                name="EMP_FIRST_NAME"
                placeholder="Primer Nombre"
                value={formData.EMP_FIRST_NAME}
                onChange={handleChange}
              />
              <FormInput
                fluid
                label="Segundo Nombre"
                type="text"
                name="EMP_MIDDLE_NAME"
                placeholder="Primer Apellido"
                value={formData.EMP_MIDDLE_NAME}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup widths="equal">
              <FormInput
                fluid
                label="Primer Apellido"
                type="text"
                name="EMP_LAST_NAME"
                placeholder="Primer Apellido"
                value={formData.EMP_LAST_NAME}
                onChange={handleChange}
              />
              <FormInput
                fluid
                label="Segundo Apellido"
                type="text"
                name="EMP_SECONDLAST_NAME"
                placeholder="Segundo Apellido"
                value={formData.EMP_SECONDLAST_NAME}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <FormInput
                fluid
                label="Correo"
                type="email"
                name="EMP_EMAIL"
                placeholder="Correo"
                value={formData.EMP_EMAIL}
                onChange={handleChange}
                width={6}
              />
              <FormInput
                fluid
                label="Teléfono"
                type="text"
                name="EMP_CELLPHONE"
                placeholder="Teléfono"
                value={formData.EMP_CELLPHONE}
                onChange={(e, { value }) => {
                  if (/^\d{0,8}$/.test(value)) {
                    handleChange(e, { name: "EMP_CELLPHONE", value });
                  }
                }}
                width={6}
              />
              <FormInput
                fluid
                label="NIT"
                type="text"
                name="EMP_NIT"
                placeholder="NIT"
                value={formData.EMP_NIT}
                onChange={(e) => {
                  const { value } = e.target;
                  if (/^[a-zA-Z0-9-]{0,10}$/.test(value)) {
                    handleChange(e, { name: "EMP_NIT", value });
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
                name="EMP_GENDER"
                placeholder="Selecciona Género"
                options={genderOptions}
                value={formData.EMP_GENDER}
                onChange={(e, { value }) =>
                  setFormData({ ...formData, EMP_GENDER: value })
                }
                width={6}
              />
              <FormInput
                fluid
                label="Fecha de nacimiento"
                type="date"
                name="EMP_DATE_OF_BIRTH"
                placeholder="Nacimiento"
                value={formData.EMP_DATE_OF_BIRTH}
                onChange={handleChange}
                width={6}
                max={maxDate}
                onKeyDown={(e) => e.preventDefault()}
              />
              <FormInput
                fluid
                label="Fecha de contratación"
                type="date"
                name="EMP_HIREDATE"
                placeholder="Contratación"
                value={formData.EMP_HIREDATE}
                onChange={handleChange}
                width={6}
                max={maxDateC}
                min={minDateC}
                onKeyDown={(e) => e.preventDefault()}
              />
            </FormGroup>
          </Form>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Dirección",
      render: () => (
        <Tab.Pane>
          <FormGroup>
            <FormInput
              label="Primera Linea"
              type="text"
              name="EMP_FIRST_LINE"
              placeholder="Primera Linea"
              value={formData.EMP_FIRST_LINE}
              onChange={handleChange}
              width={8}
            />
            <FormInput
              label="Segunda Linea"
              type="text"
              name="EMP_SECOND_LINE"
              placeholder="Segunda Linea"
              value={formData.EMP_SECOND_LINE}
              onChange={handleChange}
              width={8}
            />
          </FormGroup>
          <FormGroup>
            <FormInput
              label="Residencial"
              type="text"
              name="EMP_RESIDENTIARY"
              placeholder="Residencial"
              value={formData.EMP_RESIDENTIARY}
              onChange={handleChange}
              width={7}
            />
            <FormInput
              label="Avenida"
              type="text"
              name="EMP_AVENUE"
              placeholder="Avenida"
              value={formData.EMP_AVENUE}
              onChange={handleChange}
              width={7}
            />
            <FormInput
              label="Zona"
              type="text"
              name="EMP_ZONE"
              placeholder="Zona"
              value={formData.EMP_ZONE}
              onChange={(e, { value }) => {
                if (/^\d{0,2}$/.test(value)) {
                  handleChange(e, { name: "EMP_ZONE", value });
                }
              }}
              width={4}
            />
          </FormGroup>
          <FormGroup>
            <FormField
              control={Select}
              options={departamentos}
              label={{
                children: "Departamento",
                htmlFor: "form-select-control-departamento",
              }}
              placeholder="Selecciona Departamento"
              search
              searchInput={{ id: "form-select-control-departamento" }}
              value={selectedDepartamento}
              onChange={handleDepartamentoChange}
              width={9}
            />
            <FormField
              control={Select}
              options={municipios}
              label={{
                children: "Municipio",
                htmlFor: "form-select-control-municipio",
              }}
              placeholder="Selecciona Municipio"
              search
              searchInput={{ id: "form-select-control-municipio" }}
              value={selectedMunicipio}
              onChange={handleMunicipioChange}
              width={9}
            />
          </FormGroup>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Imagen",
      render: () => (
        <Tab.Pane>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FormField style={{ marginRight: "125px", marginLeft: "25px" }}>
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
      <Button onClick={closeModal} inverted color="brown">
        <Icon name="close" /> Cerrar
      </Button>
    </Form>
  );
};

export default EmployeeForm;
