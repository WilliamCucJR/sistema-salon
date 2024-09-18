import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';  // Import CSS for Calendar
import AppointmentCalendar from './Calendar';
import './Appointment.css'

const StatsPanel = () => {
  return (
    <div className="stats-panel">
      <div className="stat-item">
        <h2>Q 1,200.00</h2>
        <p>Ganancias</p>
      </div>
      <div className="stat-item">
        <h2>12</h2>
        <p>Servicios</p>
      </div>
      <div className="stat-item">
        <h2>8</h2>
        <p>Clientes</p>
      </div>
    </div>
  );
};

const AppointmentForm = ({ date, onClose }) => {
  return (
    <div className="appointment-form">
      <h3>Agendar Cita - {date.toLocaleDateString()}</h3>
      <form>
        <label>Cliente</label>
        <input type="text" />
        <label>Teléfono</label>
        <input type="text" />
        <label>Tratamiento</label>
        <input type="text" />
        <label>Especialista</label>
        <select>
          <option value="1">Especialista 1</option>
          <option value="2">Especialista 2</option>
        </select>
        <button type="submit">Guardar</button>
      </form>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
};

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDayClick = (value) => {
    setSelectedDate(value);
  };

  const handleCloseForm = () => {
    setSelectedDate(null);
  };

  return (
    <div className="dashboard">
      <main className="main-content">
        <StatsPanel />
        <AppointmentCalendar
            onClickDay={handleDayClick}
        />
        {selectedDate && (
          <AppointmentForm date={selectedDate} onClose={handleCloseForm} />
        )}
      </main>
    </div>
  );
};

export default Appointments;