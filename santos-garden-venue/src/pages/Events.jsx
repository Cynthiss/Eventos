import { useState, useEffect } from "react";
import { api } from "../services/api.js"; // Asegúrate de tener el API configurado

export default function Events() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.getEvents().then((data) => setEvents(data));
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const checkAvailability = () => {
    const selected = new Date(selectedDate);
    const isPastDate = selected < new Date();
    if (isPastDate) {
      setMessage("La fecha seleccionada ya ha pasado. Elige una fecha futura.");
      return;
    }

    const availableEvent = events.find(
      (event) =>
        event.date === selectedDate &&
        event.type === "public" && // Solo permitir reservar si es público
        event.status !== "reserved"
    );

    if (availableEvent) {
      setMessage(`La fecha ${selectedDate} está disponible. ¡Reserva ahora!`);
    } else {
      setMessage("La fecha seleccionada está ocupada o es privada.");
    }
  };

  return (
    <section id="events" className="container my-5">
      <h2 className="text-center">Consulta las Fechas Disponibles</h2>

      <input
        type="date"
        className="form-control mb-3"
        onChange={handleDateChange}
        value={selectedDate}
      />
      <button className="btn btn-primary" onClick={checkAvailability}>
        Verificar Disponibilidad
      </button>

      {message && <p className="mt-3 text-center">{message}</p>}

      {/* Filtrado de eventos públicos */}
      <div className="row">
        {events
          .filter((event) => event.type === "public") // Solo eventos públicos
          .map((event) => (
            <div key={event.id} className="col-md-4">
              <div className="card">
                <img src={event.image} alt={event.title} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{event.title}</h5>
                  <p className="card-text">{event.date}</p>
                  <p className="card-text">{event.place}</p>
                  <p className="card-text">
                    {event.type === "public" ? "Abierto al público" : "Evento privado"}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
