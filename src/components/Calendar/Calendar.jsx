import { useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import es from "date-fns/locale/es";
import '../Calendar/Calendar.css'

const messages = {
  allDay: "Todo el día",
  previous: "Anterior",
  next: "Siguiente",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "Sin eventos"
};

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function AppointmentCalendar({ onSelectSlot }) {
  const [events, setEvents] = useState([]);
  const [customers, setCustomers] = useState([]); 
  const [employees, setEmployees] = useState([]); 
  const [services, setServices] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(''); // Estado para el empleado seleccionado

  const urlBase = import.meta.env.VITE_DEVELOP_URL_API;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${urlBase}/customers`); 
        const customerData = await response.json();
        setCustomers(customerData);  
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    fetchCustomers();
  }, [urlBase]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${urlBase}/employees`); 
        const employeeData = await response.json();
        setEmployees(employeeData);  
      } catch (error) {
        console.error("Error al obtener los empleados:", error);
      }
    };

    fetchEmployees();
  }, [urlBase]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${urlBase}/services`); 
        const serviceData = await response.json();
        setServices(serviceData);  
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    };

    fetchServices();
  }, [urlBase]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${urlBase}/dates`);
        const data = await response.json();

        const formattedEvents = data.map(event => {
          const customer = customers.find(c => c.CUS_ID === event.CUS_ID);
          const employee = employees.find(e => e.EMP_ID === event.EMP_ID);
          const service = services.find(s => s.SER_ID === event.SER_ID);
          const customerName = customer ? `${customer.CUS_FIRST_NAME} ${customer.CUS_LAST_NAME}` : 'Cliente Desconocido';
          const employeeName = employee ? `${employee.EMP_FIRST_NAME} ${employee.EMP_LAST_NAME}` : 'Empleado Desconocido'; 
          const serviceName = service ? service.SER_SERVICENAME : 'Servicio Desconocido';

          return {
            id: event.DAT_ID,
            title: `Cliente: ${customerName}, Empleado: ${employeeName}, Servicio: ${serviceName}`,
            start: new Date(event.DAT_START), 
            end: new Date(event.DAT_END),     
            employeeId: event.EMP_ID // Agregar el ID del empleado al evento
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    if (customers.length > 0 && employees.length > 0 && services.length > 0) {
      fetchEvents();
    }
  }, [urlBase, customers, employees, services]);

  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
  };

  const filteredEvents = selectedEmployee
    ? events.filter(event => event.employeeId == selectedEmployee)
    : events;

  return (
    <div style={{ height: '450px', width: '88rem' }}>
    <div className='filter'>
      <label>Filtrar por: </label>
        <select onChange={handleEmployeeChange} value={selectedEmployee} className='filter-by-employee'>
          <option value="">Todos los empleados</option>
          {employees.map(employee => (
            <option key={employee.EMP_ID} value={employee.EMP_ID}>
              {employee.EMP_FIRST_NAME} {employee.EMP_LAST_NAME}
            </option>
          ))}
        </select>
    </div>
    
      <Calendar
        localizer={localizer}
        culture="es"
        messages={messages}
        events={filteredEvents} // Filtrar eventos
        startAccessor="start"
        endAccessor="end"
        style={{ margin: '50px' }}
        selectable
        onSelectSlot={onSelectSlot}
      />
    </div>
  );
}
