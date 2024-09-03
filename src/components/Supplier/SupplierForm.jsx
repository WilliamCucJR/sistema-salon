import { useState, useEffect } from "react";
import {
  FormField,
  Button,
  Form,
  Tab,
  Select,
  FormGroup,
  FormInput,
} from "semantic-ui-react";
import Swal from "sweetalert2";
import guatemalaData from "../../data/guatemala.json";

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

      setSelectedDepartamento(transformedData.SUP_STATE || "");
      setSelectedMunicipio(transformedData.SUP_CITY || "");
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
    setFormData({ ...formData, SUP_STATE: value, SUP_CITY: "" });
  };

  const handleMunicipioChange = (e, { value }) => {
    setSelectedMunicipio(value);
    setFormData({ ...formData, SUP_CITY: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mapeo de nombres de campos a textos de labels
    const fieldLabels = {
      SUP_NIT: "NIT",
      SUP_SOCIAL_NAME: "Razón Social",
      SUP_NAME: "Nombre",
      SUP_FIRST_LINE: "Primera Línea",
      SUP_SECOND_LINE: "Segunda Línea",
      SUP_RESIDENTIARY: "Residencial",
      SUP_AVENUE: "Avenida",
      SUP_ZONE: "Zona",
      SUP_CITY: "Municipio",
      SUP_STATE: "Departamento",
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
          <FormGroup widths="equal">
            <FormInput
              fluid
              label="ID"
              type="number"
              name="SUP_ID"
              placeholder="ID"
              value={formData.SUP_ID}
              onChange={handleChange}
              readOnly
            />
            <FormInput
              fluid
              label="NIT"
              type="text"
              name="SUP_NIT"
              placeholder="NIT"
              value={formData.SUP_NIT}
              onChange={(e) => {
                const { value } = e.target;
                if (/^[a-zA-Z0-9]{0,10}$/.test(value)) {
                  handleChange(e, { name: "SUP_NIT", value });
                }
              }}
            />
          </FormGroup>

          <FormGroup widths="equal">
            <FormInput
              fluid
              label="Razón Social"
              type="text"
              name="SUP_SOCIAL_NAME"
              placeholder="Razón Social"
              value={formData.SUP_SOCIAL_NAME}
              onChange={handleChange}
              width={18}
            />
          </FormGroup>
          <FormGroup widths="equal">
            <FormInput
              fluid
              label="Nombre Comercial"
              type="text"
              name="SUP_NAME"
              placeholder="Nombre"
              value={formData.SUP_NAME}
              onChange={handleChange}
              width={18}
            />
          </FormGroup>
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
              name="SUP_FIRST_LINE"
              placeholder="Primera Linea"
              value={formData.SUP_FIRST_LINE}
              onChange={handleChange}
              width={8}
            />
            <FormInput
              label="Segunda Linea"
              type="text"
              name="SUP_SECOND_LINE"
              placeholder="Segunda Linea"
              value={formData.SUP_SECOND_LINE}
              onChange={handleChange}
              width={8}
            />
          </FormGroup>
          <FormGroup>
            <FormInput
              label="Residencial"
              type="text"
              name="SUP_RESIDENTIARY"
              placeholder="Residencial"
              value={formData.SUP_RESIDENTIARY}
              onChange={handleChange}
              width={7}
            />
            <FormInput
              label="Avenida"
              type="text"
              name="SUP_AVENUE"
              placeholder="Avenida"
              value={formData.SUP_AVENUE}
              onChange={handleChange}
              width={7}
            />
            <FormInput
              label="Zona"
              type="number"
              name="SUP_ZONE"
              placeholder="Zona"
              value={formData.SUP_ZONE}
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
  ];

  return (
    <Form onSubmit={handleSubmit}>
      <div style={{ height: "400px", overflowY: "auto" }}>
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

export default SupplierForm;
