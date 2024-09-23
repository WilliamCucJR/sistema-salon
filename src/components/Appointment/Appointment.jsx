import { useState, useEffect } from 'react';
import AppointmentCalendar from './Calendar';
import Modal from '../AppointmentModal/AppointmentModal';
import './Appointment.css';
import { Button, Icon, FormGroup, FormInput, FormField } from "semantic-ui-react";
import TimePickerComponent from '../TimePicker/TimePicker';
import Swal from "sweetalert2";

const StatsPanel = () => {
  return (
    <div className="stats-panel">
      <div className="stat-item">
      <div className='icon-container' style={{display: 'flex', gap: '40px', alignItems: 'center' }}>
        <h3>Q 1,200.00</h3>
        <Icon name='chart line' size='big'/>
      </div>
        <p>Ganancias</p>
      </div>
      <div className="stat-item">
        <div className='icon-container' style={{display: 'flex', gap: '130px', alignItems: 'center'}}>
        <h2>12</h2>
        <Icon name='handshake outline' size='big'/>
        </div>
        <p>Servicios</p>
      </div>
      <div className="stat-item">
      <div className='icon-container' style={{display: 'flex', gap: '145px', alignItems: 'center' }}>
       <h2>8</h2>
        <Icon name='users' size='big'/>
      </div>
       <p>Clientes</p>
      </div>
    </div>
  );
};

const AppointmentForm = ({ 
  selectedItem,
  date, 
  onClose, 
  onFormSubmit, 
}) => {
  const urlBase = import.meta.env.VITE_DEVELOP_URL_API;

  const [formData, setFormData] = useState({
      DAT_ID: "",
      CUS_ID: "",
      EMP_ID: "",
      SER_ID: "",
      DAT_START: "",  
      DAT_END: "",  
    });
  
  useEffect(() => {
      if (selectedItem) {
        const transformedData = selectedItem.reduce((acc, curr) => {
          const key = Object.keys(curr)[0];
          acc[key] = curr[key];
          return acc;
      }, {});
  
      setFormData({
          DAT_ID: transformedData.DAT_ID || "",
          CUS_ID: transformedData.CUS_ID || "",
          EMP_ID: transformedData.EMP_ID || "",
          SER_ID: transformedData.SER_ID || "",
          DAT_START: transformedData.DAT_START || "",
          DAT_END: transformedData.DAT_END || "",
        });
      }
  }, [selectedItem]);

  const concatenateDateTime = (timeValue) => {
    const selectedDate = new Date(date);
    const [hours, minutes] = timeValue.split(':');
    selectedDate.setHours(Number(hours), Number(minutes));
    return selectedDate.toISOString();
  };
  
  const handleChange = (e, { name, value }) => {
      setFormData({ ...formData, [name]: value });
  };

  const handleTimeChange = (time, field) => {
    const dateTime = concatenateDateTime(time);
    setFormData((prevData) => ({ ...prevData, [field]: dateTime }));
  };

  const handleSubmit = async (e) => {
      e.preventDefault();

      const fieldLabels = {
        CUS_ID: "ID Cliente",
        EMP_ID: "ID Empleado",
        SER_ID: "ID Servicio",
        DAT_START: "Hora Inicio",
        DAT_END: "Hora Fin",
      };

      const requiredFields = [
        "CUS_ID",
        "EMP_ID",
        "SER_ID",
        "DAT_START",
        "DAT_END",
      ];

      const missingFields = requiredFields.filter(
        (field) => !formData[field]
      );
  
      if (missingFields.length > 0) {
        const missingFieldLabels = missingFields.map(
          (field) => fieldLabels[field]
        );
        Swal.fire({
          title: "Error",
          text: `Por favor complete los siguientes campos: ${missingFieldLabels.join(", ")}`,
          icon: "error",
        });
        return;
      }

      const method = formData.DAT_ID ? "PUT" : "POST";
      const url = formData.DAT_ID
        ? `${urlBase}dates/${formData.DAT_ID}`
        : `${urlBase}dates`;

      const response = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
      });
      
      if (response.ok) {
          console.log("Registro guardado correctamente");
      
          Swal.fire({
            title: "Guardado",
            text: "Registro enviado exitosamente!",
            icon: "success",
          });
          onFormSubmit();
          onClose();
      } else {
          Swal.fire({
            title: "Oops...",
            text: "Algo ha salido mal, intenta de nuevo!",
            icon: "error",
          });
          console.error("Error al enviar el formulario");
        }
  };

  return (
    <div className="appointment-form-container" style={{ padding: '20px' }}>
      <h4 style={{ marginBottom: '20px' }}>Agendar Cita</h4>
      <form onSubmit={handleSubmit} className="appointment-form" style={{ display: 'flex', gap: '15px' }}>

        <FormGroup widths="equal" style={{ display: 'flex', gap: '15px' }}>
          <FormInput
            fluid
            label='ID Cliente'
            type="text"
            name="CUS_ID"
            placeholder="ID"
            value={formData.CUS_ID}
            onChange={handleChange}
            style={{ width: '20rem' }}
          />
          <FormInput
            fluid
            label='Fecha'
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
            label='Tratamiento'
            name="SER_ID"
            placeholder="Tratamiento"
            value={formData.SER_ID}
            onChange={handleChange}
            style={{ width: '20rem' }}
          />
          <FormInput
            fluid
            label="Especialista"
            name="EMP_ID"
            placeholder="Especialista"
            value={formData.EMP_ID}
            onChange={handleChange}
            style={{ width: '20rem' }}
          />
        </FormGroup>

        <FormGroup widths="equal" style={{ display: 'flex', gap: '15px' }}>
          <FormField>
            <label style={{ fontWeight: 'bold' }}>Hora Inicio</label>
            <TimePickerComponent 
                onChange={(value) => handleTimeChange(value, "DAT_START")} 
            />
          </FormField>
          <FormField>
            <label style={{ fontWeight: 'bold' }}>Hora Fin</label>
            <TimePickerComponent 
                onChange={(value) => handleTimeChange(value, "DAT_END")} 
            />
          </FormField>
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
    console.log("Día seleccionado:", slotInfo.start); 
    setSelectedDate(slotInfo.start);
    setIsModalOpen(true); 
  };

  const handleCloseForm = () => {
    setIsModalOpen(false); 
    setSelectedDate(null);
  };

  const handleFormSubmit = (appointment) => {
    setAppointments([...appointments, appointment]);
    console.log('Cita guardada:', appointment);
    handleCloseForm(); 
  };

  return ( 
    <div className="dashboard">
      <main className="main-content">
        <StatsPanel />
        <AppointmentCalendar onSelectSlot={handleDayClick} />
        
        <Modal isOpen={isModalOpen} onClose={handleCloseForm}>
          {selectedDate && (  // Verifica que haya una fecha seleccionada antes de renderizar el formulario
            <AppointmentForm 
              date={selectedDate} 
              onClose={handleCloseForm} 
              onFormSubmit={handleFormSubmit}  // Cambia onSubmit por onFormSubmit
            />
          )}
        </Modal>
      </main>
    </div>
  );
  };
  

export default Appointments;
