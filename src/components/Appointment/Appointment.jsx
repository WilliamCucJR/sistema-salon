import { useState, useEffect } from 'react';
import AppointmentCalendar from '../Calendar/Calendar';
import Modal from '../AppointmentModal/AppointmentModal';
import './Appointment.css';
import { Button, Icon } from "semantic-ui-react";
import Swal from "sweetalert2";

const StatsPanel = () => {
  return (
    <div className="stats-panel" style={{ marginBottom: '10px' }}>
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

  //URL para API
  const urlBase = import.meta.env.VITE_DEVELOP_URL_API;

  //Inicializar data vacia
  const [formData, setFormData] = useState({
    DAT_ID: "",
    CUS_ID: "",
    EMP_ID: "",
    SER_ID: "",
    DAT_START: "",
    DAT_END: "",
  });  

  // Estado para almacenar los servicios y empleados obtenidos de la API
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  // Identificador de pasos (Steps)
  const steps = [
    { title: 'Seleccionar Servicio', description: 'Selecciona el servicio deseado de las opciones disponibles.' },
    { title: 'Seleccionar Personal', description: 'Elige a tu miembro de personal preferido para el servicio.' },
    { title: 'Seleccionar Fecha y Hora', description: 'Elige una fecha y hora adecuadas para tu reserva.' },
    { title: 'Detalles del Cliente', description: 'Introduce tus datos personales.' },
    { title: 'Confirmación', description: 'Confirma tu reserva.' },
  ];

  // Controlar el paso a traves de Steps

  const handleNext = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };
  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  // Enviar datos a BD basado en selectedItem
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

  // Llamadas a la API para obtener servicios según el paso activo
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${urlBase}services`);
        const servicesData = await response.json();
        setServices(servicesData);  // Actualizar el estado con los servicios obtenidos
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    };
  
    if (activeStep === 0) {
      fetchServices();
    }
  }, [activeStep, urlBase]);  // Lista de dependencias correcta

    // Manejador de selección de servicio
    const handleServiceSelect = (serviceId) => {
      setFormData((prevData) => ({
        ...prevData,
        SER_ID: serviceId,  // Guardar ID del servicio seleccionado
      }));
    };

    useEffect(() => {
      const fetchEmployees = async () => {
        try {
          const response = await fetch(`${urlBase}employees`);
          const employeeData = await response.json();
          setEmployees(employeeData);  // Actualizar el estado con los servicios obtenidos
        } catch (error) {
          console.error("Error al obtener los empleados:", error);
        }
      };
    
      if (activeStep === 1) {
        fetchEmployees();
      }
    }, [activeStep, urlBase]);  // Lista de dependencias correcta
  
      // Manejador de selección de servicio
      const handleEmployeeSelect = (employeeId) => {
        setFormData((prevData) => ({
          ...prevData,
          EMP_ID: employeeId,  // Guardar ID del servicio seleccionado
        }));
      };

  // Manejo de subida del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldLabels = {
      CUS_ID: "ID Cliente",
      EMP_ID: "ID Empleado",
      SER_ID: "ID Servicio",
      DAT_START: "Hora Inicio",
      DAT_END: "Hora Fin",
    };

    const requiredFields = ["CUS_ID", "EMP_ID", "SER_ID", "DAT_START", "DAT_END"];

    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      const missingFieldLabels = missingFields.map((field) => fieldLabels[field]);
      Swal.fire({
        title: "Error",
        text: `Por favor complete los siguientes campos: ${missingFieldLabels.join(", ")}`,
        icon: "error",
      });
      return;
    }

    const method = formData.DAT_ID ? "PUT" : "POST";
    const url = formData.DAT_ID ? `${urlBase}dates/${formData.DAT_ID}` : `${urlBase}dates`;

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
    <div className="step-form">
      <div className="step-sidebar">
        <ul>
          {steps.map((step, index) => (
            <li
              key={index}
              className={index < activeStep ? 'completed' : index === activeStep ? 'active' : 'pending'}
            >
              <div className="step-circle">
                {index < activeStep ? <Icon name="check circle" size="large" /> : <span>{index + 1}</span>}
              </div>
              <div className="step-info">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="step-content">
        <h2>{steps[activeStep].title}</h2>

        {activeStep === 0 && (
          <div className="service-cards">
            {services.map((service) => (
              <div 
                key={service.SER_ID} 
                className={`service-card ${formData.SER_ID === service.SER_ID ? 'selected' : ''}`} 
                onClick={() => handleServiceSelect(service.SER_ID)}  // Seleccionar servicio al hacer clic
                style={{ border: formData.SER_ID === service.SER_ID ? '2px solid teal' : '1px solid gray' }}
              >
                <h3>{service.SER_SERVICENAME}</h3>
                <p>Q {service.SER_VALUE}</p>
              </div>
            ))}
          </div>
        )}

        {activeStep === 1 && (
          <div className="service-cards">
           {employees.map((employee) => (
            <div 
              key={employee.EMP_ID} 
              className={`service-card ${formData.EMP_ID === employee.EMP_ID ? 'selected' : ''}`} 
              onClick={() => handleEmployeeSelect(employee.EMP_ID)}  // Seleccionar empleado al hacer clic
              style={{ border: formData.EMP_ID === employee.EMP_ID ? '2px solid teal' : '1px solid gray' }}
            >
          <h3>{employee.EMP_FIRST_NAME} {employee.EMP_LAST_NAME}</h3>
          <p>{employee.EMP_TITLE}</p>
        </div>
      ))}
    </div>
)}

        <div className="step-navigation">
          <Button onClick={onClose} inverted color="brown">
            <Icon name="close" /> Cerrar
          </Button>
          <div className="nav-buttons" style={{display: 'flex'}}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              <Icon name="arrow left" /> Atrás
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button color="teal" onClick={handleSubmit}>
                Confirmar <Icon name="check" />
              </Button>
            ) : (
              <Button color="teal" onClick={handleNext}>
                Siguiente <Icon name="arrow right" />
              </Button>
            )}
          </div>
        </div>
      </div>
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

        {/* Modal opens the StepForm instead of AppointmentForm */}
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
