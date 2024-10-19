import PictureAsPDF from "@mui/icons-material/PictureAsPDF";
import "./Report.css";

export const ReportCard = ({ name, onClick }) => (
  <div className="report-card" onClick={onClick}>
    <PictureAsPDF style={{ fontSize: 120, color: "#f50057" }} />
    <p>{name}</p>
  </div>
);
