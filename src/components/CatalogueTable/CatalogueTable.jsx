import { useState, useEffect, useCallback } from "react";
import { Table, Button, Icon, Input, Pagination } from "semantic-ui-react";
import "./CatalogueTable.css";
import Swal from "sweetalert2";

export default function CatalogueTable({
  isSidebarVisible,
  catalogueType,
  openModal,
  reload,
}) {
  const [catalogue, setCatalogue] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Número de elementos por página

  const urlBase = import.meta.env.VITE_DEVELOP_URL_API;
  const addUpdateRoute = `${urlBase}` + catalogueType;

  const catalogueFields = {
    suppliers: {
      apiFields: ["SUP_SOCIAL_NAME", "SUP_NIT", "SUP_RESIDENTIARY", "SUP_CITY"],
      tableHeaders: ["Razón Social", "NIT", "Residencial", "Ciudad"],
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
        "EMP_EMAIL",
        "EMP_HIREDATE",
        "EMP_FIRST_NAME",
        "EMP_MIDDLE_NAME",
        "EMP_LAST_NAME",
        "EMP_SECONDLAST_NAME",
        "EMP_FIRST_LINE",
        "EMP_SECOND_LINE",
        "EMP_RESIDENTIARY",
        "EMP_AVENUE",
        "EMP_ZONE",
        "EMP_CITY",
        "EMP_STATE",
        "EMP_GENDER",
        "EMP_CELLPHONE",
        "EMP_NIT",
        "EMP_DATE_OF_BIRTH",
        "EMP_IMAGEN",
      ],
    },
    customers: {
      apiFields: [
        "CUS_FIRST_NAME",
        "CUS_LAST_NAME",
        "CUS_EMAIL",
        "CUS_CELLPHONE",
      ],
      tableHeaders: ["Nombre", "Apellido", "Email", "Telefono"],
      formInputs: [
        "CUS_ID",
        "USE_ID",
        "CUS_EMAIL",
        "CUS_FIRST_NAME",
        "CUS_MIDDLE_NAME",
        "CUS_LAST_NAME",
        "CUS_SECONDLAST_NAME",
        "CUS_AFFILIATE",
        "CUS_GENDER",
        "CUS_CELLPHONE",
        "CUS_NIT",
        "CUS_DATE_OF_BIRTH",
        "CUS_IMAGEN",
      ],
    },
    services: {
      apiFields: ["SER_SERVICENAME", "SER_VALUE"],
      tableHeaders: ["Servicio", "Valor del Servicio"],
      formInputs: ["SER_ID", "SER_SERVICENAME", "SER_VALUE", "SER_IMAGEN"],
    },
    products: {
      apiFields: [
        "PRO_NAME",
        "PRO_QUANTITY",
        "PRO_UNIT",
        "PRO_STOCK",
        "PRO_VALUE",
        "PRO_DESCRIPTION",
      ],
      tableHeaders: [
        "Nombre",
        "Contenido",
        "Medida",
        "Stock",
        "Precio (Q)",
        "Descripción",
      ],
      formInputs: [
        "PRO_ID",
        "SUP_ID",
        "PRO_NAME",
        "PRO_MEASUREMENT",
        "PRO_QUANTITY",
        "PRO_UNIT",
        "PRO_STOCK",
        "PRO_VALUE",
        "PRO_DESCRIPTION",
        "PRO_IMAGEN",
      ],
    },
    // Agrega más tipos de catálogo
  };

  const getIdField = (catalogueType) => {
    const idFields = {
      suppliers: "SUP_ID",
      employees: "EMP_ID",
      services: "SER_ID",
      products: "PRO_ID",
      customers: "CUS_ID",
      // Agrega más tipos de catálogo
    };
    return idFields[catalogueType];
  };

  const idField = getIdField(catalogueType);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(addUpdateRoute);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Data", data);

      setCatalogue(data);
    } catch (error) {
      console.log(
        "Error al obtener los datos del catalogo ",
        catalogueType,
        error
      );
      setError(error);
    }
  }, [addUpdateRoute, catalogueType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [reload, fetchData]);

  const handleDelete = async (id) => {
    console.log("Entro a la funcion con id ", id);

    // Preguntar al usuario si está seguro de eliminar el registro
    Swal.fire({
      title: "¿Estás seguro?",
      text: "!No podrás revertir los cambios!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminarlo!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Solo ejecutamos la eliminación si el usuario confirmó
          const response = await fetch(`${urlBase}${catalogueType}/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          Swal.fire({
            title: "Eliminado!",
            text: "Registro eliminado correctamente!",
            icon: "success",
          });

          // Volver a cargar los datos después de eliminar
          fetchData();
        } catch (error) {
          Swal.fire({
            title: "Oops...",
            text: "Algo ha salido mal, intenta de nuevo!",
            icon: "error",
          });
          console.log("Error al eliminar el registro", error);
          setError(error);
        }
      }
    });
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCatalogue = catalogue.filter((item) =>
    fields.some((field) =>
      item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCatalogue.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePaginationChange = (e, { activePage }) =>
    setCurrentPage(activePage);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          onClick={() => handleOpenModal(null)}
          style={{
            marginBottom: "20px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
          }}
          color="teal"
        >
          <Icon name="plus" /> Agregar
        </Button>
        <Input
          icon="search"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            marginBottom: "15px",
            width: "40%",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
      </div>
      <div className="scrollable-div-table">
        {error ? (
          <div>Error al cargar los datos: {error.message}</div>
        ) : Array.isArray(catalogue) && catalogue.length > 0 ? (
          <>
            <Table
              celled
              striped
              className="table-catalogue"
              style={{
                width: isSidebarVisible ? "100%" : "100%",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
              }}
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
                {currentItems.map((item, index) => (
                  <Table.Row key={index}>
                    {fields.map((field, index) => (
                      <Table.Cell key={index}>{item[field]}</Table.Cell>
                    ))}
                    <Table.Cell style={{ textAlign: "center" }}>
                      <Button
                        onClick={() => handleOpenModal(item)}
                        icon="edit"
                        color="yellow"
                        style={{
                          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
                          marginRight: "10px",
                        }}
                      />
                      <Button
                        onClick={() => handleDelete(item[idField])}
                        icon="trash alternate"
                        color="red"
                        style={{
                          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
                          marginLeft: "10px",
                        }}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Pagination
                activePage={currentPage}
                onPageChange={handlePaginationChange}
                totalPages={Math.ceil(filteredCatalogue.length / itemsPerPage)}
                pointing
                secondary
                firstItem={null}
                lastItem={null}
              />
            </div>
          </>
        ) : (
          <div>No se encontraron registros.</div>
        )}
      </div>
    </>
  );
}
