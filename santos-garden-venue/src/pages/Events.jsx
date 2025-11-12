import { useState, useEffect } from "react";
import { api } from "../services/api.js"; // Asegúrate de que tu API esté funcionando correctamente

export default function Events() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(""); // Fecha seleccionada para comprobar disponibilidad
  const [message, setMessage] = useState(""); // Mensaje que muestra el estado de la disponibilidad
  const [availableEvents, setAvailableEvents] = useState([]); // Lista de eventos públicos disponibles

  // Cargar eventos desde el backend
  useEffect(() => {
    api.getEvents().then((data) => {
      setEvents(data);
      // Filtrar los eventos públicos
      const publicEvents = data.filter((event) => event.type === "public");
      setAvailableEvents(publicEvents);
    });
  }, []);

  // Cambiar la fecha seleccionada
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Verificar disponibilidad de la fecha
  const checkAvailability = () => {
    const selected = new Date(selectedDate);
    const isPastDate = selected < new Date();
    
    // Verificar si la fecha seleccionada es en el pasado
    if (isPastDate) {
      setMessage("La fecha seleccionada ya ha pasado. Elige una fecha futura.");
      return;
    }

    // Buscar si ya existe un evento en la fecha seleccionada
    const existingEvent = events.find((event) => event.date === selectedDate);
    
    // Si hay un evento en esa fecha, mostrar que está ocupada
    if (existingEvent) {
      setMessage("La fecha seleccionada está ocupada o no está disponible para reservar.");
      return;
    }

    // Si no hay conflictos de fecha, permitir la reserva
    setMessage(`La fecha ${selectedDate} está disponible para reservar.`);
  };

  // Función para reservar asiento
  const handleReserve = (event) => {
    // Aquí agregarías la lógica para realizar la reserva (por ejemplo, llamar a una API).
    alert(`¡Has reservado un asiento para el evento: ${event.title} el ${event.date}!`);
  };

  return (
    <section id="events" className="container my-5">
      <h2 className="text-center mb-4">Consulta las Fechas Disponibles</h2>
      
      {/* Campo de selección de fecha */}
      <input
        type="date"
        className="form-control mb-3"
        onChange={handleDateChange}
        value={selectedDate}
      />
      <button className="btn btn-primary" onClick={checkAvailability}>
        Verificar Disponibilidad
      </button>

      {/* Mostrar el mensaje de disponibilidad */}
      {message && <p className="mt-3 text-center">{message}</p>}

      {/* Filtrado de eventos públicos */}
      <div className="row">
        {availableEvents.length === 0 ? (
          <p>No hay eventos disponibles para reservar</p>
        ) : (
          availableEvents.map((event) => (
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
                  {/* Solo mostrar botón de reserva si es público */}
                  {event.type === "public" && (
                    <button
                      className="btn btn-success"
                      onClick={() => handleReserve(event)} // Aquí se realiza la reserva
                    >
                      Reservar Asiento
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
