import { useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import es from "date-fns/locale/es";
import Swal from 'sweetalert2';
import '../Calendar/Calendar.css';

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

export default function AppointmentCalendar() {
  const [events, setEvents] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeColors, setEmployeeColors] = useState({});
  const currentTime = useState(new Date());

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

    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${urlBase}/employees`);
        const employeeData = await response.json();
        setEmployees(employeeData);
        generateRandomColors(employeeData); // Generar colores aleatorios para empleados
      } catch (error) {
        console.error("Error al obtener los empleados:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch(`${urlBase}/services`);
        const serviceData = await response.json();
        setServices(serviceData);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    };

    fetchCustomers();
    fetchEmployees();
    fetchServices();
  }, [urlBase]);

  const generateRandomColors = (employees) => {
    const newColors = {};
    employees.forEach(employee => {
      const color = '#' + Math.floor(Math.random() * 16777215).toString(16); // Color aleatorio
      newColors[employee.EMP_ID] = color;
    });
    setEmployeeColors(newColors);
  };

  const isLightColor = (color) => {
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${urlBase}/dates`);
        const data = await response.json();

        const formattedEvents = data
        .filter(event => event.DAT_STATUS !== 0) // Filtrar las citas canceladas
        .map(event => {
          const customer = customers.find(c => c.CUS_ID === event.CUS_ID);
          const employee = employees.find(e => e.EMP_ID === event.EMP_ID);
          const service = services.find(s => s.SER_ID === event.SER_ID);
          const customerName = customer ? `${customer.CUS_FIRST_NAME} ${customer.CUS_LAST_NAME}` : 'Cliente Desconocido';
          const employeeName = employee ? `${employee.EMP_FIRST_NAME} ${employee.EMP_LAST_NAME}` : 'Empleado Desconocido';
          const serviceName = service ? service.SER_SERVICENAME : 'Servicio Desconocido';
          const isPast = new Date(event.DAT_END) < currentTime; // Verificar si la cita ya pasó
      
          if (isPast && event.DAT_STATUS !== 2) {
            // Cambiar automatico de estado
            updateEventStatus(event.DAT_ID, 2); 
          }
      
          return {
            id: event.DAT_ID,
            title: `${customerName}, ${employeeName}, ${serviceName}`, // Solo incluir los nombres
            start: new Date(event.DAT_START),
            end: new Date(event.DAT_END),
            employeeId: event.EMP_ID,
            status: event.DAT_STATUS,
            isPast: isPast
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
  }, [urlBase, customers, employees, services, currentTime]);

  const updateEventStatus = async (eventId, status) => {
    try {
      await fetch(`${urlBase}/dates/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ DAT_STATUS: status })
      });
    } catch (error) {
      console.error("Error al actualizar el estado de la cita:", error);
    }
  };

  const handleEventClick = (event) => {
    Swal.fire({
      title: 'Detalles de la cita',
      html: `
        <button 
          id="closeSwalBtn" 
          style="position: absolute; top: 10px; right: 10px; font-size: 18px; background: none; border: none; cursor: pointer;"
        >
          &times;
        </button>
        <div style="text-align: left; margin-top: 5px;">
          <p><strong>Cliente:</strong> ${event.title.split(', ')[0]}</p> <!-- Solo el nombre del cliente -->
          <p><strong>Empleado:</strong> ${event.title.split(', ')[1]}</p> <!-- Solo el nombre del empleado -->
          <p><strong>Servicio:</strong> ${event.title.split(', ')[2]}</p> <!-- Solo el nombre del servicio -->
          <p><strong>Estado:</strong> ${event.status === 1 ? 'Agendada' : event.status === 2 ? 'Completada' : 'Cancelada'}</p>
          <div style="margin-top: 20px; text-align: right;">
            <button id="completeBtn" class="swal2-confirm swal2-styled" style="${event.status !== 1 || event.isPast ? 'background-color: grey; cursor: not-allowed;' : 'background-color: teal;'}" ${event.status !== 1 || event.isPast ? 'disabled' : ''}>Atender Cita</button>
            <button id="cancelBtn" class="swal2-cancel swal2-styled" style="${event.status !== 1 || event.isPast ? 'background-color: grey; cursor: not-allowed;' : 'background-color: #C86F11; '}" ${event.status !== 1 || event.isPast ? 'disabled' : ''}>Cancelar Cita</button>
          </div>
        </div>
      `,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => {
        document.getElementById('closeSwalBtn').addEventListener('click', () => {
          Swal.close();
        });
    
        if (event.status === 1 && !event.isPast) {
          document.getElementById('completeBtn').addEventListener('click', () => {
            updateEventStatus(event.id, 2);
            Swal.close();
            window.location.reload();
          });
          document.getElementById('cancelBtn').addEventListener('click', () => {
            updateEventStatus(event.id, 0); 
            Swal.close();
            window.location.reload();
          });
        }
      }
    });
        
  };

  const filteredEvents = selectedEmployee
    ? events.filter(event => event.employeeId == selectedEmployee)
    : events;

  return (
    <div style={{ height: '450px', width: '88rem' }}>
      <div className='filter'>
        <label>Filtrar por: </label>
        <select onChange={(e) => setSelectedEmployee(e.target.value)} value={selectedEmployee} className='filter-by-employee'>
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
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ margin: '50px' }}
        selectable
        onSelectEvent={handleEventClick}
        eventPropGetter={(event) => {
          const backgroundColor = employeeColors[event.employeeId] || '#3174ad'; 
          const textColor = isLightColor(backgroundColor) ? 'black' : 'white'; 
          
          return {
            style: {
              backgroundColor: backgroundColor,
              color: textColor,
              textDecoration: event.status === 2 ? 'line-through' : 'none', // Tachado si está completada
              opacity: event.isPast && event.status !== 2 ? 0.5 : 1, // Opacidad para citas pasadas
            }
          };
        }}
      />
    </div>
  );
}
