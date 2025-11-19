import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
// IMPORTA App.css DESPUÉS del css del calendario
import "../App.css";

export default function AvailabilityCalendar({ events = [] }) {
  const takenDates = events.map((ev) => ev.date);

  const tileClassName = ({ date }) => {
    const iso = date.toISOString().slice(0, 10);
    if (takenDates.includes(iso)) {
      return "date-taken";
    }
    return null;
  };

  return (
    <div className="calendar-container my-4">
      <h3 className="mb-3 text-center">Calendario de disponibilidad</h3>

      <Calendar
        minDate={new Date()}
        tileClassName={tileClassName}
      />

      <div className="mt-3 text-center">
        <span className="badge bg-danger me-2">Ocupado</span>
        <span className="badge bg-success">Disponible</span>
      </div>
    </div>
  );
}
