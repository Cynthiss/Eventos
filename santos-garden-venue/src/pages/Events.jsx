// src/pages/Events.jsx
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext.jsx";
import AvailabilityCalendar from "../components/AvailabilityCalendar.jsx";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availabilityMsg, setAvailabilityMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState("closest");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState(null);
  const [modalQty, setModalQty] = useState(1);
  const [modalError, setModalError] = useState("");

  const { token } = useAuth();

  useEffect(() => {
    api.getEvents().then(setEvents).catch(console.error);
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  /* ======================================================
        FILTRO DE EVENTOS
  ====================================================== */
  const filteredPublicEvents = (() => {
    let list = events.filter((ev) => ev.type === "public");

    if (search.trim()) {
      list = list.filter((ev) =>
        `${ev.title} ${ev.place ?? ""}`.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (showOnlyAvailable) {
      list = list.filter((ev) => ev.guests > 0);
    }

    return list.sort((a, b) => {
      if (sortBy === "closest") return new Date(a.date) - new Date(b.date);
      if (sortBy === "priceLow") return (a.price || 0) - (b.price || 0);
      if (sortBy === "priceHigh") return (b.price || 0) - (a.price || 0);
      return 0;
    });
  })();

  /* ======================================================
        MODAL
  ====================================================== */
  const openReserveModal = (ev) => {
    setStatusMsg("");
    setModalError("");

    if (!token) return setStatusMsg("Debes iniciar sesión para reservar asientos.");
    if (ev.date < today) return setStatusMsg("No puedes reservar eventos pasados.");
    if (ev.date === today) return setStatusMsg("No puedes reservar en el mismo día.");
    if (ev.guests <= 0) return setStatusMsg("Este evento ya no tiene cupo.");

    setModalEvent(ev);
    setModalQty(1);
    setModalOpen(true);
  };

  const confirmReservation = async () => {
    if (!modalEvent) return;

    setModalError("");

    const qty = Number(modalQty);
    if (qty <= 0) return setModalError("Cantidad inválida.");
    if (qty > modalEvent.guests)
      return setModalError(`Solo hay ${modalEvent.guests} disponibles.`);

    try {
      const { reservation, updatedEvent } = await api.createReservation(
        modalEvent._id,
        qty,
        token
      );

      setEvents((prev) =>
        prev.map((e) => (e._id === updatedEvent._id ? updatedEvent : e))
      );

      setStatusMsg(`Reserva realizada con éxito. Asientos restantes: ${updatedEvent.guests}.`);

      setModalOpen(false);
      setModalEvent(null);
      setModalQty(1);
    } catch (err) {
      setModalError(err.message || "Error desconocido.");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalEvent(null);
    setModalQty(1);
    setModalError("");
  };

  /* ======================================================
        VERIFICAR FECHA DEL SALÓN
  ====================================================== */
  const checkDateAvailability = () => {
    setAvailabilityMsg("");

    if (!selectedDate)
      return setAvailabilityMsg("Por favor selecciona una fecha.");

    const selected = selectedDate;

    if (selected === today)
      return setAvailabilityMsg("No puedes reservar el mismo día.");

    if (selected < today)
      return setAvailabilityMsg("La fecha ya pasó.");

    const dateTaken = events.some((ev) => ev.date === selected);

    setAvailabilityMsg(
      dateTaken
        ? `❌ La fecha ${selected} ya está ocupada.`
        : `✅ La fecha ${selected} está disponible.`
    );
  };

  const totalEstimado =
    modalEvent?.price ? modalQty * modalEvent.price : 0;

  return (
    <section className="container my-5">
      <h1 className="text-center fw-bold mb-3">Eventos</h1>

      {/* Calendario */}
      <h3 className="section-title">Disponibilidad del salón</h3>
      <div className="card shadow-sm p-4 mb-4">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <AvailabilityCalendar events={events} />
          </div>
        </div>
      </div>

      {/* Consultar fecha */}
      <h3 className="section-title">Consultar fecha disponible</h3>
      <div className="card shadow-sm p-4 mb-4">
        <div className="row">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Selecciona una fecha</label>
            <input
              type="date"
              value={selectedDate}
              className="form-control"
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="col-md-3 d-flex align-items-end">
            <button className="btn btn-primary w-100" onClick={checkDateAvailability}>
              Verificar fecha
            </button>
          </div>

          <div className="col-md-5 d-flex align-items-end">
            {availabilityMsg && <p className="mb-0">{availabilityMsg}</p>}
          </div>
        </div>
      </div>

      <div className="section-divider"></div>

      {/* Filtros */}
      <h3 className="section-title">Buscar y filtrar eventos públicos</h3>
      <div className="card shadow-sm p-4 mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Buscar</label>
            <input
              className="form-control"
              value={search}
              placeholder="Ej. Convivio, Conferencia..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Ordenar por</label>
            <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="closest">Fecha más cercana</option>
              <option value="priceLow">Precio más bajo</option>
              <option value="priceHigh">Precio más alto</option>
            </select>
          </div>

          <div className="col-md-2">
            <div className="form-check mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                checked={showOnlyAvailable}
                onChange={(e) => setShowOnlyAvailable(e.target.checked)}
              />
              <label className="form-check-label">Solo con cupo</label>
            </div>
          </div>
        </div>
      </div>

      <div className="section-divider"></div>

      {/* Lista de eventos */}
      <h3 className="section-title">Eventos públicos</h3>

      {filteredPublicEvents.length === 0 ? (
        <p className="text-center mt-4">No hay eventos disponibles.</p>
      ) : (
        <div className="row mt-3">
          {filteredPublicEvents.map((ev) => (
            <div key={ev._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm h-100 p-4 border-0" style={{ borderRadius: "18px" }}>
                <h5 className="fw-bold">{ev.title}</h5>

                <p><strong>Fecha:</strong> {ev.date}</p>
                {ev.place && <p><strong>Lugar:</strong> {ev.place}</p>}
                <p><strong>Asientos disponibles:</strong> {ev.guests}</p>
                <p><strong>Precio:</strong> Q {ev.price}</p>

                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={() => openReserveModal(ev)}
                  disabled={ev.date <= today || ev.guests <= 0}
                >
                  {ev.date < today ? "Evento pasado" : ev.date === today ? "Hoy" : "Reservar asiento"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =============== MODAL =============== */}
      {modalOpen && modalEvent && (
        <>
          <div className="modal-backdrop show" style={{ opacity: 0.5 }}></div>

          <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title">Reservar asientos</h5>
                  <button className="btn-close" onClick={closeModal}></button>
                </div>

                <div className="modal-body">
                  <p>
                    <strong>Evento:</strong> {modalEvent.title}<br />
                    <strong>Fecha:</strong> {modalEvent.date}<br />
                    <strong>Disponibles:</strong> {modalEvent.guests}
                  </p>

                  {modalError && <div className="alert alert-danger py-2">{modalError}</div>}

                  <div className="mb-3">
                    <label className="form-label">Cantidad</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      value={modalQty}
                      onChange={(e) => setModalQty(e.target.value)}
                    />
                  </div>

                  <p><strong>Total estimado:</strong> Q {totalEstimado}</p>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
                  <button className="btn btn-primary" onClick={confirmReservation}>Confirmar</button>
                </div>

              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
