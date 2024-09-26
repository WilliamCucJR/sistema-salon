import { useState, useEffect } from 'react';
import AppointmentCalendar from '../Calendar/Calendar';
import Modal from '../AppointmentModal/AppointmentModal';
import './Appointment.css';
import { Button, Icon } from "semantic-ui-react";
import Swal from "sweetalert2";

const StatsPanel = () => {
  return (
    <div className="stats-panel" style={{marginBottom: '10px'}}>
      <div className="stat-item">
        <div className='icon-container' style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <h3>Q 1,200.00</h3>
          <Icon name='chart line' size='big' />
        </div>
        <p>Ganancias</p>
      </div>
      <div className="stat-item">
        <div className='icon-container' style={{ display: 'flex', gap: '130px', alignItems: 'center' }}>
          <h2>12</h2>
          <Icon name='handshake outline' size='big' />
        </div>
        <p>Servicios</p>
      </div>
      <div className="stat-item">
        <div className='icon-container' style={{ display: 'flex', gap: '145px', alignItems: 'center' }}>
          <h2>8</h2>
          <Icon name='users' size='big' />
        </div>
        <p>Clientes</p>
      </div>
    </div>
  );
};

const AppointmentForm = ({ selectedItem, onClose, onFormSubmit }) => {
  const urlBase = import.meta.env.VITE_DEVELOP_URL_API;

  const [formData, setFormData] = useState({
    DAT_ID: "",
    CUS_ID: "",
    EMP_ID: "",
    SER_ID: "",
    DAT_START: "",
    DAT_END: "",
  });  

//Enviar datos a BD
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
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsModalOpen(false);
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
        <div style={{ marginLeft: '50px', textAlign: 'left' }}>
          <Button color="teal" onClick={handleAddButtonClick}>
            <Icon name="plus" /> Agregar
          </Button>
        </div>
        <AppointmentCalendar />

        <Modal isOpen={isModalOpen} onClose={handleCloseForm}>
          <AppointmentForm 
            onClose={handleCloseForm} 
            onFormSubmit={handleFormSubmit} 
          />
        </Modal>
      </main>
    </div>
  );
};

export default Appointments;
