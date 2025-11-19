// src/components/Events.jsx
import { useEffect, useState } from "react";
import { api } from "../services/api";
import AvailabilityCalendar from "../components/AvailabilityCalendar";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availabilityMsg, setAvailabilityMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  // Filtros adicionales
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortOption, setSortOption] = useState("dateAsc"); // dateAsc | dateDesc

  // Cargar eventos desde la API (MongoDB)
  useEffect(() => {
    api
      .getEvents()
      .then(setEvents)
      .catch((err) => console.error("Error cargando eventos:", err));
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // ===========================
  // FILTRADO Y ORDEN DE EVENTOS
  // ===========================
  const filteredPublicEvents = events
    // Solo eventos públicos
    .filter((ev) => ev.type === "public")
    // Filtro por búsqueda de título
    .filter((ev) => {
      const text = `${ev.title ?? ""}`.toLowerCase();
      return text.includes(search.toLowerCase());
    })
    // Filtro: solo eventos con asientos disponibles
    .filter((ev) => {
      if (!onlyAvailable) return true;
      return ev.guests && ev.guests > 0 && ev.date >= todayStr;
    })
    // Orden por fecha
    .slice() // para no mutar el array original
    .sort((a, b) => {
      if (sortOption === "dateDesc") {
        return b.date.localeCompare(a.date); // más lejanos primero
      }
      return a.date.localeCompare(b.date); // más cercanos primero
    });

  // ===========================
  // RESERVA DE ASIENTOS
  // ===========================
  const handleReserveSeat = async (ev) => {
    setStatusMsg("");

    // Evento pasado
    if (ev.date < todayStr) {
      setStatusMsg("No puedes reservar asientos en un evento que ya pasó.");
      return;
    }

    if (!ev.guests || ev.guests <= 0) {
      setStatusMsg("Este evento ya no tiene asientos disponibles.");
      return;
    }

    // Pedir cantidad al usuario
    const qtyStr = window.prompt(
      `¿Cuántos asientos deseas reservar para "${ev.title}"? (Disponibles: ${ev.guests})`,
      "1"
    );
    if (!qtyStr) return;

    const qty = parseInt(qtyStr, 10);

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
        guests: ev.guests - qty,
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

  // ===========================
  // CONSULTAR DISPONIBILIDAD DEL SALÓN
  // ===========================
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
      <h1 className="text-center mb-2">Eventos</h1>
      <h4 className="text-center mb-4 text-muted">
        Calendario de disponibilidad
      </h4>

      {/* CALENDARIO */}
      <AvailabilityCalendar events={events} />

      {/* BUSCADOR */}
      <div className="row mb-3 mt-4">
        <div className="col-md-6 mx-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* FILTROS EXTRAS */}
      <div className="row mb-4 justify-content-center">
        <div className="col-md-4 d-flex align-items-center justify-content-center mb-2 mb-md-0">
          <div className="form-check">
            <input
              id="onlyAvailable"
              className="form-check-input"
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
            />
            <label className="form-check-label ms-1" htmlFor="onlyAvailable">
              Mostrar solo eventos con asientos disponibles
            </label>
          </div>
        </div>

        <div className="col-md-4">
          <label className="form-label mb-1">Ordenar por</label>
          <select
            className="form-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="dateAsc">Fecha más cercana primero</option>
            <option value="dateDesc">Fecha más lejana primero</option>
          </select>
        </div>
      </div>

      {/* CONSULTA DISPONIBILIDAD DEL SALÓN */}
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

      {/* MENSAJES DE ESTADO DE RESERVA */}
      {statusMsg && (
        <div className="alert alert-info text-center" role="alert">
          {statusMsg}
        </div>
      )}

      {/* LISTA DE EVENTOS PÚBLICOS */}
      {filteredPublicEvents.length === 0 ? (
        <p className="text-center mt-4">
          No hay eventos públicos que coincidan con tu búsqueda o filtro.
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
                  <p className="card-text mb-1">
                    <strong>Asientos disponibles:</strong> {ev.guests ?? 0}
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
