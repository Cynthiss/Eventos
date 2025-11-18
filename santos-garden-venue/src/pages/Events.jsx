// src/components/Events.jsx
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availabilityMsg, setAvailabilityMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  // Cargar eventos desde la API (MongoDB)
  useEffect(() => {
    api
      .getEvents()
      .then(setEvents)
      .catch((err) => console.error("Error cargando eventos:", err));
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // Filtrar solo eventos públicos + búsqueda
  const filteredPublicEvents = events
    .filter((ev) => ev.type === "public")
    .filter((ev) => {
      const text = `${ev.title ?? ""} ${ev.place ?? ""}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });

  // Reservar asiento(s) en un evento público
  const handleReserveSeat = async (ev) => {
    setStatusMsg("");

    // No permitir reservar en fechas pasadas
    if (ev.date < todayStr) {
      setStatusMsg("No puedes reservar asientos en un evento que ya pasó.");
      return;
    }

    if (!ev.guests || ev.guests <= 0) {
      setStatusMsg("Este evento ya no tiene asientos disponibles.");
      return;
    }

    // Pedir cantidad de asientos al usuario
    const qtyStr = window.prompt(
      `¿Cuántos asientos deseas reservar para "${ev.title}"? (Disponibles: ${ev.guests})`,
      "1"
    );

    // Si canceló o dejó vacío
    if (!qtyStr) return;

    const qty = parseInt(qtyStr, 10);

    // Validaciones de la cantidad
    if (isNaN(qty) || qty <= 0) {
      setStatusMsg("Debes ingresar una cantidad válida de asientos.");
      return;
    }

    if (qty > ev.guests) {
      setStatusMsg(
        `Solo hay ${ev.guests} asientos disponibles. No puedes reservar ${qty}.`
      );
      return;
    }

    const confirmReserve = window.confirm(
      `¿Confirmas la reserva de ${qty} asiento(s) para "${ev.title}"?`
    );
    if (!confirmReserve) return;

    try {
      const updated = await api.updateEvent(ev._id, {
        ...ev,
        guests: ev.guests - qty, // restamos la cantidad elegida
      });

      // Actualizar estado local
      setEvents((prev) =>
        prev.map((e) => (e._id === ev._id ? updated : e))
      );

      setStatusMsg(
        `Reserva realizada con éxito. Asientos restantes: ${updated.guests}`
      );
    } catch (err) {
      console.error(err);
      setStatusMsg("Ocurrió un error al reservar los asientos.");
    }
  };

  // Consultar disponibilidad del salón por fecha
  const checkDateAvailability = () => {
    setAvailabilityMsg("");

    if (!selectedDate) {
      setAvailabilityMsg("Por favor selecciona una fecha.");
      return;
    }

    if (selectedDate < todayStr) {
      setAvailabilityMsg("La fecha seleccionada ya pasó. Elige una fecha futura.");
      return;
    }

    const dateTaken = events.some((ev) => ev.date === selectedDate);

    if (dateTaken) {
      setAvailabilityMsg(
        `La fecha ${selectedDate} ya tiene un evento programado. Elige otra fecha.`
      );
    } else {
      setAvailabilityMsg(
        `La fecha ${selectedDate} está disponible para reservar el salón.`
      );
    }
  };

  return (
    <section className="container my-5">
      <h1 className="text-center mb-4">Eventos</h1>

      {/* Buscador */}
      <div className="row mb-4">
        <div className="col-md-6 mx-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por título o lugar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Consulta de fecha del salón */}
      <div className="row mb-4">
        <div className="col-md-4">
          <label className="form-label">Consultar disponibilidad del salón</label>
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <button
            className="btn btn-outline-primary w-100"
            onClick={checkDateAvailability}
          >
            Verificar fecha
          </button>
        </div>
        <div className="col-md-5 d-flex align-items-end">
          {availabilityMsg && (
            <p className="mb-0 text-muted">{availabilityMsg}</p>
          )}
        </div>
      </div>

      {/* Mensajes de estado de reservas */}
      {statusMsg && (
        <div className="alert alert-info text-center" role="alert">
          {statusMsg}
        </div>
      )}

      {/* Lista de eventos públicos */}
      {filteredPublicEvents.length === 0 ? (
        <p className="text-center mt-4">
          No hay eventos públicos que coincidan con tu búsqueda.
        </p>
      ) : (
        <div className="row">
          {filteredPublicEvents.map((ev) => (
            <div key={ev._id} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{ev.title}</h5>
                  <p className="card-text mb-1">
                    <strong>Fecha:</strong> {ev.date}
                  </p>
                  {ev.place && (
                    <p className="card-text mb-1">
                      <strong>Lugar:</strong> {ev.place}
                    </p>
                  )}
                  <p className="card-text mb-1">
                    <strong>Tipo:</strong> Evento público
                  </p>
                  <p className="card-text mb-1">
                    <strong>Asientos disponibles:</strong>{" "}
                    {ev.guests ?? 0}
                  </p>
                  <p className="card-text mb-3">
                    <strong>Precio entrada:</strong>{" "}
                    {ev.price ? `Q ${ev.price}` : "Q 0.00"}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleReserveSeat(ev)}
                    disabled={
                      ev.date < todayStr || !ev.guests || ev.guests <= 0
                    }
                  >
                    {ev.date < todayStr
                      ? "Evento pasado"
                      : ev.guests && ev.guests > 0
                      ? "Reservar asiento"
                      : "Sin cupo"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
