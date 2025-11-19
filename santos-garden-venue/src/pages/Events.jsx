// src/components/Events.jsx
import { useEffect, useState } from "react";
import { api } from "../services/api";
import AvailabilityCalendar from "../components/AvailabilityCalendar"; // ajusta ruta si hace falta

export default function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availabilityMsg, setAvailabilityMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  // Filtros
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortOption, setSortOption] = useState("dateAsc"); // dateAsc | dateDesc

  // Modal de reserva
  const [modalEvent, setModalEvent] = useState(null);
  const [modalQty, setModalQty] = useState(1);
  const [modalError, setModalError] = useState("");

  // Cargar eventos desde la API
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
    .filter((ev) => ev.type === "public")
    .filter((ev) => {
      const text = `${ev.title ?? ""}`.toLowerCase();
      return text.includes(search.toLowerCase());
    })
    .filter((ev) => {
      if (!onlyAvailable) return true;
      return ev.guests && ev.guests > 0 && ev.date >= todayStr;
    })
    .slice()
    .sort((a, b) => {
      if (sortOption === "dateDesc") {
        return b.date.localeCompare(a.date);
      }
      return a.date.localeCompare(b.date);
    });

  // ===========================
  // MODAL DE RESERVA
  // ===========================
  const openReserveModal = (ev) => {
    setStatusMsg("");
    setModalError("");
    setModalQty(1);
    setModalEvent(ev);
  };

  const closeReserveModal = () => {
    setModalEvent(null);
    setModalQty(1);
    setModalError("");
  };

  const confirmReserve = async () => {
    if (!modalEvent) return;
    const ev = modalEvent;
    const qty = Number(modalQty);

    // Usar el id que exista (_id o id)
    const eventId = ev._id ?? ev.id;

    // Validaciones
    if (ev.date < todayStr) {
      setModalError("No puedes reservar asientos en un evento que ya pasó.");
      return;
    }

    if (!ev.guests || ev.guests <= 0) {
      setModalError("Este evento ya no tiene asientos disponibles.");
      return;
    }

    if (isNaN(qty) || qty <= 0) {
      setModalError("Debes ingresar una cantidad válida de asientos.");
      return;
    }

    if (qty > ev.guests) {
      setModalError(
        `Solo hay ${ev.guests} asientos disponibles. No puedes reservar ${qty}.`
      );
      return;
    }

    try {
      // PATCH a /api/events/:id con el id correcto
      const updated = await api.updateEvent(eventId, {
        ...ev,
        guests: ev.guests - qty,
      });

      // Actualizar estado local usando ese mismo id
      setEvents((prev) =>
        prev.map((e) => {
          const currentId = e._id ?? e.id;
          return currentId === eventId ? updated : e;
        })
      );

      setStatusMsg(
        `Reserva realizada con éxito. Asientos restantes: ${updated.guests}`
      );
      closeReserveModal();
    } catch (err) {
      console.error(err);
      setModalError("Ocurrió un error al reservar los asientos.");
    }
  };

  const totalEstimado =
    modalEvent && modalQty
      ? (modalEvent.price || 0) * Number(modalQty || 0)
      : 0;

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
      <p className="text-center text-muted mb-4">
        Revisa la disponibilidad del salón y reserva asientos en eventos públicos.
      </p>

      {/* CALENDARIO */}
      <AvailabilityCalendar events={events} />

      {/* CARD DE FILTROS Y CONSULTA */}
      <div className="d-flex justify-content-center mt-4">
        <div
          className="card shadow-sm border-0 w-100"
          style={{ maxWidth: "900px" }}
        >
          <div className="card-body">
            {/* BUSCADOR + ORDEN */}
            <div className="row g-3 align-items-end mb-3">
              <div className="col-md-7">
                <label className="form-label">Buscar por título</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej. Convivio, Conferencia UFM..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-5">
                <label className="form-label">Ordenar por</label>
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

            {/* CHECKBOX SOLO DISPONIBLES */}
            <div className="mb-4">
              <div className="form-check">
                <input
                  id="onlyAvailable"
                  className="form-check-input"
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="onlyAvailable">
                  Mostrar solo eventos con asientos disponibles
                </label>
              </div>
            </div>

            {/* CONSULTAR DISPONIBILIDAD DEL SALÓN */}
            <h6 className="mb-2">Consultar disponibilidad del salón</h6>
            <div className="row g-3 mb-2">
              <div className="col-md-6">
                <input
                  type="date"
                  className="form-control"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={checkDateAvailability}
                >
                  Verificar fecha
                </button>
              </div>
            </div>
            {availabilityMsg && (
              <p className="mb-0 text-muted">{availabilityMsg}</p>
            )}
          </div>
        </div>
      </div>

      {/* MENSAJE DE ESTADO DE RESERVA */}
      {statusMsg && (
        <div className="alert alert-info text-center mt-4" role="alert">
          {statusMsg}
        </div>
      )}

      {/* LISTA DE EVENTOS PÚBLICOS */}
      {filteredPublicEvents.length === 0 ? (
        <p className="text-center mt-4">
          No hay eventos públicos que coincidan con tu búsqueda o filtro.
        </p>
      ) : (
        <div className="row mt-4">
          {filteredPublicEvents.map((ev) => {
            const keyId = ev._id ?? ev.id;
            return (
              <div key={keyId} className="col-md-6 mb-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex flex-column">
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
                    <div className="mt-auto">
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => openReserveModal(ev)}
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
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE RESERVA */}
      {modalEvent && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reservar asientos</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeReserveModal}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-1">
                  <strong>Evento:</strong> {modalEvent.title}
                </p>
                <p className="mb-1">
                  <strong>Fecha:</strong> {modalEvent.date}
                </p>
                <p className="mb-3">
                  <strong>Asientos disponibles:</strong> {modalEvent.guests}
                </p>

                {modalError && (
                  <div className="alert alert-danger py-2">{modalError}</div>
                )}

                <div className="mb-3">
                  <label className="form-label">Cantidad de asientos</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    max={modalEvent.guests}
                    value={modalQty}
                    onChange={(e) => setModalQty(e.target.value)}
                  />
                </div>

                <p className="mb-0">
                  <strong>Total estimado:</strong> Q {totalEstimado}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={closeReserveModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={confirmReserve}
                >
                  Confirmar reserva
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
