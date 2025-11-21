import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../App.css";

export default function AvailabilityCalendar({ events = [] }) {
  const takenDates = events.map((ev) => ev.date);
  const today = new Date().toISOString().slice(0, 10);

  const tileClassName = ({ date }) => {
    const iso = date.toISOString().slice(0, 10);

    // Días pasados → gris claro
    if (iso < today) return "date-past";

    // Ocupados → rojo
    if (takenDates.includes(iso)) return "date-taken";

    // Disponibles → verde en hover
    return "date-available";
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
