import { useState, useEffect } from 'react';
import AppointmentCalendar from '../Calendar/Calendar';
import Modal from '../AppointmentModal/AppointmentModal';
import './Appointment.css';
import { Button, Icon } from "semantic-ui-react";
import Swal from "sweetalert2";
import { Calendar } from 'react-multi-date-picker';
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

const AppointmentForm = ({ onClose, onFormSubmit }) => {

  //URL para API
  const urlBase = import.meta.env.VITE_DEVELOP_URL_API;
  const urlImage = import.meta.env.VITE_DEVELOP_URL_FILE;

  //Inicializar data para Appointments
  const [formData, setFormData] = useState({
    DAT_ID: "",
    CUS_ID: "",
    EMP_ID: "",
    SER_ID: "",
    DAT_START: "",
    DAT_END: "",
    DAT_STATUS: 0,
  }); 

  const [orderData, setOrderData] = useState({
    ORD_ID: "",
    ORD_IDENTIFIER: "",
    ORD_ORDER_DATE: "",
    CUS_ID: 1,
    PRO_ID: null,
    SER_ID: "",
    ORD_QUANTITY: 1,
    ORD_TOTAL: "",
    ORD_STATUS: 0,
  }); 
 
  // Estado para almacenar
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");   

  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [disabledTimes, setDisabledTimes] = useState([]);

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

  // Condición para habilitar o deshabilitar el botón "Siguiente"
  const isNextButtonDisabled = () => {
    if (activeStep === 0 && !selectedService) return true; // Step 1: Servicio
    if (activeStep === 1 && !selectedEmployee) return true; // Step 2: Personal
    if (activeStep === 2 && (!selectedDate || !selectedTime)) return true; // Step 3: Fecha y Hora
    if (activeStep === 3 && !selectedCustomer) return true; // Step 4: Cliente
    return false;
  };

  // Llamadas a la API para obtener servicios
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${urlBase}services`);
        const servicesData = await response.json();
        setServices(servicesData); 
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    };
  
    if (activeStep === 0) {
      fetchServices();
    }
  }, [activeStep, urlBase]);  

    useEffect(() => {
      console.log("OrderData actualizado:", orderData);
    }, [orderData]);

  // Manejador de selección de servicio
  const handleServiceSelect = (serviceId) => {
    console.log("ID Servicio seleccionado:", serviceId);

    const service = services.find(service => service.SER_ID == serviceId);
    setSelectedService(service);

    setFormData((prevData) => ({
      ...prevData,
      SER_ID: serviceId,  
      SER_DURATION: 60, // Duración fija de 1 hora para todos los servicios
    }));

    setOrderData((prevData) => ({
      ...prevData,
      SER_ID: serviceId,  
    }));

    setOrderData((prevData) => ({
      ...prevData,
      ORD_TOTAL: selectedService?.SER_VALUE || 0,
    }));
  
  };

    // Llamadas a la API para obtener Empleados
    useEffect(() => {
      const fetchEmployees = async () => {
        try {
          const response = await fetch(`${urlBase}employees`);
          const employeeData = await response.json();
          setEmployees(employeeData);  
        } catch (error) {
          console.error("Error al obtener los empleados:", error);
        }
      };
    
      if (activeStep === 1) {
        fetchEmployees();
      }
    }, [activeStep, urlBase]); 
  
  // Manejador de selección de empleados
  const handleEmployeeSelect = (employeeId) => {
    const employee = employees.find(emp => emp.EMP_ID == employeeId);
    setSelectedEmployee(employee);
    console.log("ID Empleado seleccionado:", employeeId);
    
    setFormData((prevData) => ({
      ...prevData,
      EMP_ID: employeeId,
    }));
  };

  // Manejador de selección de fecha
  const handleDateChange = (date) => {
    setSelectedDate(date); 
  };

  //Validar fechas max de citas
  const today = new Date();
  const maxDateAppointment = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 30
  );
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const maxDateA = formatDate(maxDateAppointment);


  // Manejador de selección de hora
  const handleTimeSelect = (time) => {
    setSelectedTime(time); 

    if (selectedDate) {
      const fullDateTime = new Date(selectedDate);
      const [hours, minutes] = time.split(':').map(Number);

      fullDateTime.setHours(hours, minutes, 0, 0);

      const year = fullDateTime.getFullYear();
      const month = String(fullDateTime.getMonth() + 1).padStart(2, '0');
      const day = String(fullDateTime.getDate()).padStart(2, '0');
      const formattedHours = String(fullDateTime.getHours()).padStart(2, '0');
      const formattedMinutes = String(fullDateTime.getMinutes()).padStart(2, '0');
      const formattedSeconds = String(fullDateTime.getSeconds()).padStart(2, '0');
      const mysqlTimestamp = `${year}-${month}-${day} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

      const endDateTime = new Date(fullDateTime.getTime() + 60 * 60000); // 60 minutos = 1 hora
      const endYear = endDateTime.getFullYear();
      const endMonth = String(endDateTime.getMonth() + 1).padStart(2, '0');
      const endDay = String(endDateTime.getDate()).padStart(2, '0');
      const endHours = String(endDateTime.getHours()).padStart(2, '0');
      const endMinutes = String(endDateTime.getMinutes()).padStart(2, '0');
      const endSeconds = String(endDateTime.getSeconds()).padStart(2, '0');
      const endMySQLTimestamp = `${endYear}-${endMonth}-${endDay} ${endHours}:${endMinutes}:${endSeconds}`;

      const orderIdentifier = `ORD1${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`;
      const orderDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
     
      setFormData((prevData) => ({
        ...prevData,
        DAT_START: mysqlTimestamp,
        DAT_END: endMySQLTimestamp,
      }));

      setOrderData((prevData) => ({
        ...prevData,
        ORD_IDENTIFIER: orderIdentifier,
        ORD_ORDER_DATE: orderDate,
      }));

      console.log("Inicio Cita: ", mysqlTimestamp);
      console.log("Fin Cita:", endMySQLTimestamp);
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${urlBase}dates`);
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error al obtener las citas:", error);
      }
    };
  
    if (selectedEmployee) {
      const employeeAppointments = appointments.filter(
        (appointment) => appointment.EMP_ID === selectedEmployee.EMP_ID
      );
      setFilteredAppointments(employeeAppointments);
    }
  
    fetchAppointments();
  }, [selectedEmployee, appointments, urlBase]);
  

  // Filtrar y deshabilitar horas ocupadas por el empleado en la fecha seleccionada
  useEffect(() => {
    if (selectedDate && filteredAppointments.length > 0) {
      const selectedDateObj = new Date(selectedDate);
  
      const busyTimes = filteredAppointments
        .filter(appointment => {
          const appointmentDate = new Date(appointment.DAT_START);
          return appointmentDate.toDateString() === selectedDateObj.toDateString();
        })
        .map(appointment => {
          const appointmentTime = new Date(appointment.DAT_START).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // Para obtener formato de 24 horas
          });
          return appointmentTime;
        });
  
      setDisabledTimes(busyTimes);
    } else {
      setDisabledTimes([]);
    }
  }, [selectedDate, filteredAppointments]);
  
  


    // Llamadas a la API para obtener Clientes
    useEffect(() => {
      const fetchCustomers = async () => {
        try {
          const response = await fetch(`${urlBase}customers`);
          const customerData = await response.json();
          setCustomers(customerData);  
        } catch (error) {
          console.error("Error al obtener los clientes:", error);
        }
      };

      if (activeStep === 3) {
        fetchCustomers();
      }
    }, [activeStep, urlBase]); 

// Manejador de selección de cliente
const handleCustomerSelect = (event) => {
  const customerId = event.target.value;
  console.log("ID Cliente seleccionado:", customerId);
  setSelectedCustomer(customerId);

  const customer = customers.find(cust => cust.CUS_ID == customerId);
  setSelectedCustomer(customer);

  setFormData((prevData) => ({
    ...prevData,
    CUS_ID: customerId,
    CUS_CELLPHONE: customer ? customer.CUS_CELLPHONE : "",
    CUS_EMAIL: customer ? customer.CUS_EMAIL : "",
    CUS_NIT: customer ? customer.CUS_NIT : "",
    CUS_GENDER: customer ? customer.CUS_GENDER : "",
  }));
};

// Manejo de subida del formulario
const handleSubmit = async (e) => {
  e.preventDefault();

  // Omitir SER_DURATION de la desestructuración
  const { SER_DURATION, CUS_CELLPHONE, CUS_EMAIL, CUS_GENDER, CUS_NIT, ...dataToSubmit } = formData;
  console.log("Duracion a omitir", SER_DURATION, CUS_CELLPHONE, CUS_EMAIL, CUS_GENDER, CUS_NIT)
  console.log("Datos a enviar:", dataToSubmit);

  const method = dataToSubmit.DAT_ID ? "PUT" : "POST";
  const urlAppointment = dataToSubmit.DAT_ID ? `${urlBase}dates/${dataToSubmit.DAT_ID}` : `${urlBase}dates`;
  const urlOrder = orderData.ORD_ID ? `${urlBase}cart/${orderData.ORD_ID}` : `${urlBase}cart`;

  const response = await fetch(urlAppointment, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSubmit),
  });
  const OrderResponse = await fetch(urlOrder, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
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

  if (OrderResponse.ok) {
    console.log("Orden guardada correctamente");
    onFormSubmit();
    onClose();
} else {
    console.error("Error al crear orden");
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
                onClick={() => handleServiceSelect(service.SER_ID)} 
                style={{ border: formData.SER_ID === service.SER_ID ? '2px solid teal' : '1px solid gray' }}
              >
              <img 
                src={`${urlImage}${service.SER_IMAGEN}`} 
                className="service-image" 
              />
                <h3 className='service-title'>{service.SER_SERVICENAME}</h3>
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
          <img 
                src={`${urlImage}${employee.EMP_IMAGEN}`} 
                className="service-image" 
          />
          <h3 className='service-title'>{employee.EMP_FIRST_NAME} {employee.EMP_LAST_NAME}</h3>
          <p>{employee.EMP_TITLE}</p>
        </div>
      ))}
    </div>
)}
      {activeStep === 2 && (
        <div>
          <div className="calendar-selection">
            <Calendar
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              minDate={today}
              maxDate={maxDateA}
            />
            {selectedDate && (
              <div className="time-slots">
                {Array.from({ length: 14 }, (_, index) => {
                  const hour = 7 + index;
                  const timeString = `${String(hour).padStart(2, '0')}:00`;  // Formato de 24 horas
                  const isDisabled = disabledTimes.includes(timeString);

                  return (
                    <div
                      key={timeString}
                      className={`time-slot ${isDisabled ? 'disabled' : ''} ${selectedTime === timeString ? 'selected' : ''}`}
                      onClick={() => !isDisabled && handleTimeSelect(timeString)}
                    >
                      {timeString} {hour < 12 ? "AM" : "PM"}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
 
)}
{activeStep === 3 && (
  <div>
    <div className='customer-container'>
      <label className='instruction customer-details-label'>1. Seleccionar Cliente</label>
      <div>
        <label className='customer-details-label select' style={{width: '160px'}}>Cliente</label>
        <select
          id="customer-select"
          value={formData.CUS_ID}
          onChange={handleCustomerSelect}
          className="dynamic-input"
          style={{cursor: 'pointer'}}
        >
          <option value="">Seleccione cliente</option>
          {customers.map((customer) => (
            <option key={customer.CUS_ID} value={customer.CUS_ID}>
              {customer.CUS_FIRST_NAME} {customer.CUS_LAST_NAME}
            </option>
          ))}
        </select>
      </div>
    </div>
    {formData.CUS_ID && (
      <div className="customer-details">
        <label className='instruction customer-details-label'>2. Verificar datos</label>
        <div>
          <label className='customer-details-label'>Email:</label>
          <input
            type="email"
            value={formData.CUS_EMAIL}
            readOnly
            className="dynamic-input"
          />
        </div>
        <div>
          <label className='customer-details-label'>Teléfono:</label>
          <input
            type="text"
            value={formData.CUS_CELLPHONE}
            readOnly
            className="dynamic-input"
          />
        </div>
        <div>
          <label className='customer-details-label'>NIT:</label>
          <input
            type="text"
            value={formData.CUS_NIT}
            readOnly
            className="dynamic-input"
          />
        </div>
        <div>
          <label className='customer-details-label'>Género:</label>
          <div className="gender-options">
            <label className='customer-details-label'>
              <input
                type="radio"
                name="gender"
                value="masculino"
                checked={formData.CUS_GENDER == 'masculino'}
                onChange={() => setFormData((prevData) => ({
                  ...prevData,
                  CUS_GENDER: 'masculino',
                }))}
                style={{marginRight:'5px'}}
              />
              Masculino
              <span className="radio-dot"></span>
            </label>
            <label className='customer-details-label'>
              <input
                type="radio"
                name="gender"
                value="femenino"
                checked={formData.CUS_GENDER == 'femenino'}
                onChange={() => setFormData((prevData) => ({
                  ...prevData,
                  CUS_GENDER: 'femenino',
                }))}
                style={{marginRight:'5px'}}
              />
              Femenino
              <span className="radio-dot"></span>
            </label>
          </div>
        </div>
      </div>
    )}
  </div>
)}

{activeStep === 4 && (
  <div className="appointment-summary">
  {/* Resumen Cita */}
  <div className="summary-card">
    <h4>Resumen cita</h4>
    <div className="summary-details">
      <div className="summary-item">
        <strong>Especialista: </strong> {selectedEmployee.EMP_FIRST_NAME} {selectedEmployee.EMP_LAST_NAME}
      </div>
      <div className="summary-item">
        <strong>Fecha de inicio: </strong> {formData.DAT_START}
      </div>
      <div className="summary-item">
        <strong>Fecha de fin: </strong> {formData.DAT_END}
      </div>
      <div className='services-summary'>
      <strong>Servicios </strong>
      <div className='service-price'>
        {selectedService.SER_SERVICENAME} <span className='service-value'> Q{selectedService.SER_VALUE}</span> 
      </div>
      <strong>Impuestoss </strong>
      <div className='service-price'>
      IVA<span className='service-value tax'> Q 0.00</span> 
      </div>
      <div className='service-price total-card'>
      <strong className='total-price'>Total </strong><span className='service-value total-value tot'> Q{selectedService.SER_VALUE}</span>
      </div>
      </div>
    </div>
  </div>

  {/* Detalles del Cliente */}
  <div className="customer-card">
    <div className="summary-customer-details">
    <h4>Detalles del Cliente</h4>
      <div className="customer-item">
        <strong>Nombre: </strong> {selectedCustomer.CUS_FIRST_NAME} {selectedCustomer.CUS_LAST_NAME}
      </div>
      <div className="customer-item">
        <strong>Correo Electrónico: </strong> {formData.CUS_EMAIL}
      </div>
      <div className="customer-item">
        <strong>Teléfono: </strong> {formData.CUS_CELLPHONE}
      </div>
    </div>
  </div>
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
              <Button color="teal" onClick={handleNext} disabled={isNextButtonDisabled()}>
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
