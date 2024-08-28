import { useState, useEffect, useCallback } from "react";
import { Table, Button } from "semantic-ui-react";
import "./CatalogueTable.css";

export default function CatalogueTable({
  isSidebarVisible,
  catalogueType,
  openModal,
  reload,
}) {
  const [catalogue, setCatalogue] = useState([]);
  const [error, setError] = useState(null);
  const ruta = "http://localhost:3000/api/" + catalogueType;

  const catalogueFields = {
    suppliers: {
      apiFields: ["SUP_SOCIAL_NAME", "SUP_NIT", "SUP_RESIDENTIARY", "SUP_CITY"],
      tableHeaders: ["Nombre Social", "NIT", "Residencial", "Ciudad"],
      formInputs: [
        "SUP_ID",
        "SUP_NIT",
        "SUP_SOCIAL_NAME",
        "SUP_NAME",
        "SUP_FIRST_LINE",
        "SUP_SECOND_LINE",
        "SUP_RESIDENTIARY",
        "SUP_AVENUE",
        "SUP_ZONE",
        "SUP_CITY",
        "SUP_STATE",
      ],
    },
    employees: {
      apiFields: ["EMP_FIRST_NAME", "EMP_LAST_NAME", "EMP_EMAIL", "EMP_CITY"],
      tableHeaders: ["Nombre", "Apellido", "Email", "Ciudad"],
      formInputs: [
        "EMP_ID",
        "USE_ID",
        "EMP_EMAIL",
        "EMP_HIREDATE",
        "EMP_FIRST_NAME",
        "EMP_MIDDEL_NAME",
        "EMP_LAST_NAME",
        "EMP_SECONDLAST_NAME",
        "EMP_FIRST_LINE",
        "EMP_SECOND_LINE",
        "EMP_RESIDENTIARY",
        "EMP_AVENUE",
        "EMP_ZONE",
        "EMP_CITY",
        "EMP_STATE",
      ],
    },
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(ruta);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCatalogue(data);
    } catch (error) {
      console.log(
        "Error al obtener los datos del catalogo ",
        catalogueType,
        error
      );
      setError(error);
    }
  }, [ruta, catalogueType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [reload, fetchData]);

  const handleDelete = async (id) => {
    console.log("Entro a la funcion con id ", id);

    try {
      const response = await fetch(
        `http://localhost:3000/api/suppliers/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      alert("Registro eliminado correctamente");
      fetchData();
    } catch (error) {
      console.log("Error al eliminar el registro", error);
      setError(error);
    }
  };

  const fields = catalogueFields[catalogueType]?.apiFields || [];
  const headers = catalogueFields[catalogueType]?.tableHeaders || [];
  const formInputs = catalogueFields[catalogueType]?.formInputs || [];

  const handleOpenModal = (item) => {
    if (item === null) {
      item = {};
    }
    const selectedData = formInputs.map((input) => ({
      [input]: item[input] || "",
    }));
    openModal(selectedData);
  };

  return (
    <>
      <Button onClick={() => handleOpenModal(null)} style={{ marginBottom:'20px' }}>Agregar +</Button>
      <div className="scrollable-div-table">
        {error ? (
          <div>Error al cargar los datos: {error.message}</div>
        ) : Array.isArray(catalogue) && catalogue.length > 0 ? (
          <Table
            celled
            striped
            className="table-catalogue"
            style={{ width: isSidebarVisible ? "75%" : "100%" }}
          >
            <Table.Header>
              <Table.Row>
                {headers.map((header, index) => (
                  <Table.HeaderCell key={index}>{header}</Table.HeaderCell>
                ))}
                <Table.HeaderCell>Acciones</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {catalogue.map((item, index) => (
                <Table.Row key={index}>
                  {fields.map((field, index) => (
                    <Table.Cell key={index}>{item[field]}</Table.Cell>
                  ))}
                  <Table.Cell style={{ textAlign: "center" }}>
                    <Button onClick={() => handleOpenModal(item)} icon="edit" />
                    <Button
                      onClick={() => handleDelete(item.SUP_ID)}
                      icon="trash alternate"
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <div>No hay datos disponibles</div>
        )}
      </div>
    </>
  );
}
