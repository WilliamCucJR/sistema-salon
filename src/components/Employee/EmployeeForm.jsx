import { useState, useEffect } from "react";
import {
  FormField,
  Button,
  Form,
  Tab,
  FormGroup,
  FormInput,
  Select,
} from "semantic-ui-react";
import { InputFile } from "semantic-ui-react-input-file";
import Swal from "sweetalert2";
import guatemalaData from "../../data/guatemala.json";

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

    if (employee.EMP_DATE_OF_BIRTH) {
      employee.EMP_DATE_OF_BIRTH = formatDate(employee.EMP_DATE_OF_BIRTH);
    }
    // Agrega más campos de fecha si es necesario
  });

  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState("");

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
    USE_ID: "",
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
        USE_ID: transformedData.USE_ID || null,
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
    };

    const Fields = Object.keys(fieldLabels);

    for (const field of Fields) {
      if (!formData[field]) {
        Swal.fire({
          title: "Error",
          text: `El campo ${fieldLabels[field]} es obligatorio.`,
          icon: "error",
        });
        return;
      }
    }

    const method = formData.EMP_ID ? "PUT" : "POST";
    const url = formData.EMP_ID
      ? `${urlBase}${catalogueType}/${formData.EMP_ID}`
      : `${urlBase}${catalogueType}`;
    const USE_ID = formData.USE_ID === "" ? null : formData.USE_ID;

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        USE_ID: USE_ID,
        EMP_EMAIL: formData.EMP_EMAIL,
        EMP_HIREDATE: formData.EMP_HIREDATE,
        EMP_FIRST_NAME: formData.EMP_FIRST_NAME,
        EMP_MIDDLE_NAME: formData.EMP_MIDDLE_NAME,
        EMP_LAST_NAME: formData.EMP_LAST_NAME,
        EMP_SECONDLAST_NAME: formData.EMP_SECONDLAST_NAME,
        EMP_GENDER: formData.EMP_GENDER,
        EMP_CELLPHONE: formData.EMP_CELLPHONE,
        EMP_NIT: formData.EMP_NIT,
        EMP_DATE_OF_BIRTH: formData.EMP_DATE_OF_BIRTH,
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
                  if (/^[a-zA-Z0-9]{0,10}$/.test(value)) {
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
              type="number"
              name="EMP_ZONE"
              placeholder="Zona"
              value={formData.EMP_ZONE}
              onChange={handleChange}
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
      menuItem: "Otros",
      render: () => (
        <Tab.Pane>
          <FormField>
            <label>Seleccionar Imagen</label>
            <InputFile
              input={{
                id: "input-file",
              }}
            />
          </FormField>
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
        Guardar
      </Button>
      <Button onClick={closeModal} inverted color='brown'>
        Cerrar
      </Button>
    </Form>
  );
};

export default EmployeeForm;
