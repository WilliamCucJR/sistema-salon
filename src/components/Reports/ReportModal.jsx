import { useState } from "react";
import { Modal, Box, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { Button, Icon } from "semantic-ui-react";
import "./Report.css";

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
  const [option, setOption] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");

  const handleGenerateReport = () => {
    console.log(`Generando ${reportName} desde ${dateFrom} hasta ${dateTo}`);
    if (reportName === "Productos" || reportName === "Servicios" || reportName === "Citas" || reportName === "Clientes" || reportName === "Ventas") {
      console.log(`Opción seleccionada: ${option}`);
    }
    onClose();
  };

  const renderComboBox = () => {
    switch (reportName) {
      case "Productos":
        return (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="product-select-label">Opciones de Productos</InputLabel>
            <Select
              labelId="product-select-label"
              value={option}
              label="Opciones de Productos"
              onChange={(e) => setOption(e.target.value)}
            >
              <MenuItem value="productos-inventario">Productos en inventario</MenuItem>
              <MenuItem value="productos-inventario">Productos mas vendidos</MenuItem>
              <MenuItem value="productos-inventario">Productos menos vendidos</MenuItem>
            </Select>
          </FormControl>
        );
      case "Servicios":
        return (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="service-select-label">Opciones de Servicios</InputLabel>
            <Select
              labelId="service-select-label"
              value={option}
              label="Opciones de Servicios"
              onChange={(e) => setOption(e.target.value)}
            >
              <MenuItem value="servicios-mas-demandados">Servicios más demandados</MenuItem>
              <MenuItem value="servicios-menos-demandados">Servicios menos demandados</MenuItem>
            </Select>
          </FormControl>
        );
      case "Citas":
        return (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="appointments-select-label">Opciones de Citas</InputLabel>
            <Select
              labelId="appointments-select-label"
              value={option}
              label="Opciones de Citas"
              onChange={(e) => setOption(e.target.value)}
            >
              <MenuItem value="citas-agendadas">Citas agendadas</MenuItem>
              <MenuItem value="citas-canceladas">Citas canceladas</MenuItem>
            </Select>
          </FormControl>
        );
      case "Clientes":
        return (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="clients-select-label">Opciones de Clientes</InputLabel>
            <Select
              labelId="clients-select-label"
              value={option}
              label="Opciones de Clientes"
              onChange={(e) => setOption(e.target.value)}
            >
              <MenuItem value="clientes-frecuentes">Clientes frecuentes</MenuItem>
              <MenuItem value="clientes-nuevos">Clientes nuevos</MenuItem>
            </Select>
          </FormControl>
        );
      case "Ventas":
        return (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="sales-select-label">Opciones de Ventas</InputLabel>
            <Select
              labelId="sales-select-label"
              value={option}
              label="Opciones de Ventas"
              onChange={(e) => setOption(e.target.value)}
            >
              <MenuItem value="ventas-mes">Ventas por mes</MenuItem>
              <MenuItem value="ventas-ano">Ventas por año</MenuItem>
            </Select>
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
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
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
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
        <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
          <Button
            variant="contained"
            className="reports-button"
            color="teal"
            onClick={handleGenerateReport}
          >
            Generar Reporte
          </Button>
        </div>

      </Box>
    </Modal>
  );
};
