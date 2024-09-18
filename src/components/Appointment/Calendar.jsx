import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import es from "date-fns/locale/es";

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
const locales = {
  es: es,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function AppointmentCalendar({ onSelectSlot }) {
  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        culture="es"
        messages={messages}
        startAccessor="start"
        endAccessor="end"
        style={{ margin: '50px' }}
        selectable
        onSelectSlot={onSelectSlot} // Aquí capturamos cuando se selecciona un día vacío
      />
    </div>
  );
}
