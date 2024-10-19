import { useState } from "react";
import { ReportCard } from "./ReportCard";
import { ReportModal } from "./ReportModal";
import "./Report.css";

const reports = [
  { id: 1, name: "Productos" },
  { id: 2, name: "Servicios" },
  { id: 3, name: "Citas" },
  { id: 4, name: "Clientes" },
  { id: 5, name: "Ventas" },
];

export default function Reports() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState("");

  const handleOpenModal = (reportName) => {
    setSelectedReport(reportName);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedReport("");
  };

  return (
    <div className="reports-main-container">
      <h1>Reportería</h1>
      <div className="report-container">
        {reports.map((report) => (
          <ReportCard
            key={report.id}
            name={report.name}
            onClick={() => handleOpenModal(report.name)}
          />
        ))}
      </div>
      <ReportModal 
        open={openModal}
        onClose={handleCloseModal}
        reportName={selectedReport}
      />
    </div>
  );
}

