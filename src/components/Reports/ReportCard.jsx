import { MdPictureAsPdf } from "react-icons/md";
import "./Report.css";

export const ReportCard = ({ name, onClick }) => (
  <div className="report-card" onClick={onClick}>
    <MdPictureAsPdf style={{ fontSize: 120, color: "#f50057" }} />
    <p>{name}</p>
  </div>
);
