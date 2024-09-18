import { useState } from 'react';

import AppointmentCalendar from './Calendar';
import Modal from '../AppointmentModal/AppointmentModal';
import './Appointment.css';
import { Button, Icon, FormGroup, FormInput, FormField, Select } from "semantic-ui-react";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';


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
const treatmentOptions = [
  { key: "1", text: "tratamiento1", value: "tratamiento1" },
  { key: "2", text: "tratamiento2", value: "tratamiento2" },
];

const specialistOptions = [
  { key: "1", text: "Especialista1", value: "Especialista1" },
  { key: "2", text: "Especialista2", value: "Especialista2" },
];

const AppointmentForm = ({ date, onClose, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      cliente: e.target.cliente.value,
      telefono: e.target.telefono.value,
      tratamiento: e.target.tratamiento.value,
      especialista: e.target.especialista.value,
      date,
    });
    onClose(); // Cierra el formulario después de enviar
  };


  return (
    <div className="appointment-form-container" style={{ padding: '20px' }}>
      <h4 style={{ marginBottom: '20px' }}>Agendar Cita</h4>
      <form onSubmit={handleSubmit} className="appointment-form" style={{ display: 'flex', gap: '15px' }}>
        
      <FormGroup widths="equal" style={{ display: 'flex', gap: '15px' }}>
          <FormInput
            fluid
            label="Cliente ID"
            type="text"
            name="CLIENTE ID"
            placeholder="ID"
            style={{ width: '20rem' }}
          />
          <FormInput
            fluid
            label="Fecha"
            type="text"
            name="FECHA"
            placeholder="Fecha"
            value={date.toLocaleDateString()}
            style={{ width: '20rem' }}
            readOnly
          />
        </FormGroup>
  
        <FormGroup widths="equal" style={{ display: 'flex', gap: '15px' }}>
          <FormInput
            fluid
            label="Primer nombre"
            type="text"
            name="NAME"
            placeholder="Nombre"
            style={{ width: '20rem' }}
          />
          <FormInput
            fluid
            label="Apellido"
            type="text"
            name="APELLIDO"
            placeholder="Apellido"
            style={{ width: '20rem' }}
          />
        </FormGroup>
  
        <FormGroup widths="equal" style={{ display: 'flex', gap: '15px' }}>
          <FormField
            control={Select}
            fluid
            label="Tratamiento"
            name="TRATAMIENTO"
            placeholder="Selecciona tratamiento"
            options={treatmentOptions}
            style={{ width: '20rem' }}
          />
          <FormField
            control={Select}
            fluid
            label="Especialista"
            name="ESPECIALISTA"
            placeholder="Selecciona especialista"
            options={specialistOptions}
            style={{ width: '20rem' }}
          />
        </FormGroup>
  
        <FormGroup widths="equal" style={{ display: 'flex', gap: '15px' }}>
          <FormInput
            fluid
            label="Hora inicio"
            type="text"
            name="HORAINICIO"
            placeholder="Hora inicio"
            style={{ width: '20rem' }}
          />
          <FormInput
            fluid
            label="Hora fin"
            type="text"
            name="HORAFIN"
            placeholder="Hora inicio"
            style={{ width: '20rem' }}
          />
        </FormGroup>
  
        <div className='buttons-container' style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
          <Button type="submit" color="teal">
            <Icon name="save" /> Guardar
          </Button>
          <Button onClick={onClose} inverted color="brown">
            <Icon name="close" /> Cerrar
          </Button>
        </div>
      </form>
    </div>
  );
  
  
};

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDayClick = (slotInfo) => {
    console.log("Día seleccionado:", slotInfo.start); // Verifica si la fecha es capturada
    setSelectedDate(slotInfo.start);
    setIsModalOpen(true); // Abrimos el modal cuando se selecciona una fecha
  };

  const handleCloseForm = () => {
    setIsModalOpen(false); // Cerramos el modal
    setSelectedDate(null);
  };

  const handleFormSubmit = (appointment) => {
    setAppointments([...appointments, appointment]);
    console.log('Cita guardada:', appointment);
    handleCloseForm(); // Cerramos el modal después de guardar
  };

  return (
    <div className="dashboard">
      <main className="main-content">
        <StatsPanel />
        <AppointmentCalendar onSelectSlot={handleDayClick} />
        
        {/* Modal para el formulario de citas */}
        <Modal isOpen={isModalOpen} onClose={handleCloseForm}>
          <AppointmentForm 
            date={selectedDate} 
            onClose={handleCloseForm} 
            onSubmit={handleFormSubmit} 
          />
        </Modal>
      </main>
    </div>
  );
};

export default Appointments;
