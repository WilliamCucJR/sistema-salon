import { useEffect, useState, useCallback } from "react";
import {
  Modal,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logoSistema from "../../assets/logo-sistema.png";
import { Button, Icon } from "semantic-ui-react";
import "./Report.css";
import Swal from 'sweetalert2';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};

export const ReportModal = ({ open, onClose, reportName }) => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [stateOption, setStateOption] = useState("");
  const [employeeOption, setEmployeeOption] = useState("");
  const [customerOption, setCustomerOption] = useState("");
  const [productOption, setProductOption] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const urlBase = import.meta.env.VITE_DEVELOP_URL_API;
  const urlGetEmployees = `${urlBase}employees`;
  const urlGetCustomers = `${urlBase}customers`;
  const urlGetProducts = `${urlBase}products`;
  const urlReports = `${urlBase}reports`;

  const handleGenerateReport = () => {
    let reportData = null;
    if (!selectedFormat) {
      setTimeout(() => {
        Swal.fire({
          icon: "info",
          title: "Selecciona un tipo de formato",
        });
      }); 
      return;
    }

    if (reportName === "Citas") {
      reportData = {
        reportName,
        dateFrom,
        dateTo,
        stateOption,
        employeeOption,
        selectedFormat,
      };
    } else if (reportName === "Ventas") {
      reportData = {
        reportName,
        dateFrom,
        dateTo,
        customerOption,
        productOption,
        selectedFormat,
      };
    } else if (reportName === "Servicios") {
        reportData = {
        reportName,
        dateFrom,
        dateTo,
        stateOption, 
       selectedFormat,
      };
    } else if (reportName === "Productos") {
      reportData = {
        reportName,
        dateFrom,
        dateTo,
        stateOption,
        productOption,
        selectedFormat,
      };
    } else if (reportName === "Clientes") {
      reportData = {
        reportName,
        dateFrom,
        dateTo,
        stateOption,
        customerOption,
        selectedFormat,
      };
    }

    if (reportData) {
      console.log("Generando reporte con los siguientes datos:", reportData);
    } else {
      console.log(
        "No se generó ningún reporte.", reportName
      );
    }

    const queryString = new URLSearchParams(reportData).toString();
    fetch(`${urlReports}?${queryString}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Reporte generado:", data);
        if (selectedFormat === "excel") {
          exportToExcel(data, reportName);
        } else if (selectedFormat === "pdf") {
          exportToPDF(data, reportName);
        }
      })
      .catch((error) => {
        console.error("Error al generar el reporte:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Reporte no cuenta con suficientes datos.",
        });
      });
    clearFields();
    onClose();
  };

  const clearFields = () => {
    setDateFrom("");
    setDateTo("");
    setStateOption("");
    setEmployeeOption("");
    setCustomerOption("");
    setProductOption("");
    setSelectedFormat("");
  };

  const exportToExcel = (data, reportName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "ReporteDe" + reportName + ".xlsx");
  };

  const exportToPDF = (data, reportName) => {
    const doc = new jsPDF();

    const imgWidth = 50;
    const imgHeight = 20;

    doc.addImage(logoSistema, "PNG", 10, 10, imgWidth, imgHeight);

    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.text(currentDate, doc.internal.pageSize.getWidth() - 20, 20, {
      align: "right",
    });

    const title = "Reporte de " + reportName;
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(18);
    doc.text(title, pageWidth / 2, 40, { align: "center" });

    doc.autoTable({
      startY: 50,
      head: [Object.keys(data[0])],
      body: data.map((row) => Object.values(row)),
      styles: {
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        fontSize: 8,
      },
      headStyles: {
        fillColor: [213, 213, 213],
        textColor: [0, 0, 0],
      },
    });

    doc.save("ReporteDe" + reportName + ".pdf");
  };

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await fetch(urlGetEmployees);
      const data = await response.json();
      if (Array.isArray(data)) {
        setEmployees(data);
      } else {
        console.error("Error: La respuesta de la API no es un array");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [urlGetEmployees]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);


  const fetchCustomers = useCallback(async () => {
    try {
      const response = await fetch(urlGetCustomers);
      const data = await response.json();
      if (Array.isArray(data)) {
        setCustomers(data);
      } else {
        console.error("Error: La respuesta de la API no es un array");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [urlGetCustomers]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(urlGetProducts);
      const data = await response.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Error: La respuesta de la API no es un array");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [urlGetProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);


  const renderComboBox = () => {
    switch (reportName) {
      case "Productos":
        return (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="product-select-label">
                Estado
              </InputLabel>
              <Select
                labelId="product-select-label"
                value={stateOption}
                label="Estado"
                onChange={(e) => setStateOption(e.target.value)}
              >
              <MenuItem value="1">Productos más vendidos</MenuItem>
              <MenuItem value="2">Productos menos vendidos</MenuItem>
              <MenuItem value="3">Todos los productos</MenuItem>
              </Select>
            </FormControl>
              <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'gray' }} />
                <Box sx={{ px: 2, fontWeight: 'bold' }}>o</Box>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'gray' }} />
              </Box>
              <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="product-select-label">Producto</InputLabel>
              <Select
                labelId="product-select-label"
                value={productOption}
                label="Producto"
                onChange={(e) => setProductOption(e.target.value)}
              >
                {products.map((product) => (
                  <MenuItem key={product.PRO_ID} value={product.PRO_ID}>
                    {product.PRO_NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

          </>
          
          
        );
      case "Servicios":
        return (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="service-select-label">
              Opciones
            </InputLabel>
            <Select
              labelId="service-select-label"
              value={stateOption}
              label="Opciones de Servicios"
              onChange={(e) => setStateOption(e.target.value)}
            >
              <MenuItem value="servicios-mas-demandados">
                Servicios más demandados
              </MenuItem>
              <MenuItem value="servicios-menos-demandados">
                Servicios menos demandados
              </MenuItem>
            </Select>
          </FormControl>
        );
      case "Citas":
        return (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="state-select-label">Estado</InputLabel>
              <Select
                labelId="state-select-label"
                value={stateOption}
                label="Estado"
                onChange={(e) => setStateOption(e.target.value)}
              >
                <MenuItem value="1">Citas agendadas</MenuItem>
                <MenuItem value="0">Citas canceladas</MenuItem>
                <MenuItem value="2">Citas Finalizadas</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="employee-select-label">Empleado</InputLabel>
              <Select
                labelId="employee-select-label"
                value={employeeOption}
                label="Empleado"
                onChange={(e) => setEmployeeOption(e.target.value)}
              >
                {employees.map((employee) => (
                  <MenuItem key={employee.EMP_ID} value={employee.EMP_ID}>
                    {employee.EMP_FIRST_NAME} {employee.EMP_LAST_NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );
      case "Clientes":
        return (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="clients-select-label">
              Opciones
            </InputLabel>
            <Select
              labelId="clients-select-label"
              value={stateOption}
              label="Opciones de Clientes"
              onChange={(e) => setStateOption(e.target.value)}
            >
              <MenuItem value="1">Clientes Frecuentes</MenuItem>
              <MenuItem value="2">Clientes menos frecuentes</MenuItem>
              <MenuItem value="3">Todos los clientes</MenuItem>
            </Select>
          </FormControl>
          <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'gray' }} />
                <Box sx={{ px: 2, fontWeight: 'bold' }}>o</Box>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'gray' }} />
          </Box>
          <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="customer-select-label">Cliente</InputLabel>
              <Select
                labelId="customer-select-label"
                value={customerOption}
                label="Cliente"
                onChange={(e) => setCustomerOption(e.target.value)}
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.CUS_ID} value={customer.CUS_ID}>
                    {customer.CUS_FIRST_NAME} {customer.CUS_LAST_NAME}
                  </MenuItem>
                ))}
              </Select>
          </FormControl>
          </>
        );
      case "Ventas":
        return (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="customer-select-label">Cliente</InputLabel>
              <Select
                labelId="customer-select-label"
                value={customerOption}
                label="Empleado"
                onChange={(e) => setCustomerOption(e.target.value)}
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.CUS_ID} value={customer.CUS_ID}>
                    {customer.CUS_FIRST_NAME} {customer.CUS_LAST_NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="product-select-label">Producto</InputLabel>
              <Select
                labelId="product-select-label"
                value={productOption}
                label="Producto"
                onChange={(e) => setProductOption(e.target.value)}
              >
                {products.map((product) => (
                  <MenuItem key={product.PRO_ID} value={product.PRO_ID}>
                    {product.PRO_NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal open={open} onClose={onClose} disableEnforceFocus>
      <Box sx={style} className="Modal">
        <h2>{reportName}</h2>
        <TextField
          label="Fecha Desde"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          style={{ marginTop: "10px" }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Fecha Hasta"
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />

        {renderComboBox()}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <Icon
            name="file excel outline"
            size="big"
            color={selectedFormat === "excel" ? "green" : "grey"}
            onClick={() => setSelectedFormat("excel")}
            style={{ cursor: "pointer", marginRight: "16px" }}
            onMouseDown={(e) => e.preventDefault()}
          />
          <Icon
            name="file pdf outline"
            size="big"
            color={selectedFormat === "pdf" ? "red" : "grey"}
            onClick={() => setSelectedFormat("pdf")}
            style={{ cursor: "pointer" }}
            onMouseDown={(e) => e.preventDefault()}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button 
          variant="contained"
          className="reports-button"
          color="teal" 
          onClick={handleGenerateReport}
          >
            <Icon name="save" /> Guardar  
          </Button>
          <Button
          onClick={() => {
            clearFields();
            onClose();   
          }} inverted color="brown">
            <Icon name="close" /> Cerrar
          </Button>
        </div>
      </Box>
    </Modal>
  );
};
