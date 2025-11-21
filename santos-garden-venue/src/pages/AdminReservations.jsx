// src/pages/AdminReservations.jsx
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AdminReservations() {
  const { token } = useAuth();

  const [salonReservations, setSalonReservations] = useState([]);
  const [eventReservations, setEventReservations] = useState([]);

  const [filteredSalon, setFilteredSalon] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!token) return;

    setLoading(true);

    api
      .getAllReservations(token)
      .then((data) => {
        // CORRECTO: leer ambos arrays enviados por el backend
        setSalonReservations(data.salonReservations || []);
        setEventReservations(data.eventReservations || []);

        // Inicializar filtrados
        setFilteredSalon(data.salonReservations || []);
        setFilteredEvents(data.eventReservations || []);
      })
      .catch((err) => {
        console.error("Error cargando reservas admin:", err);
        setError(err.message || "Error al cargar las reservas");
      })
      .finally(() => setLoading(false));
  }, [token]);

  // FILTRAR POR BUSCADOR
  useEffect(() => {
    const term = search.toLowerCase();

    setFilteredSalon(
      salonReservations.filter((r) => {
        const email = r.user?.email?.toLowerCase() || "";
        const type = r.eventType?.toLowerCase() || "";
        return email.includes(term) || type.includes(term);
      })
    );

    setFilteredEvents(
      eventReservations.filter((r) => {
        const email = r.user?.email?.toLowerCase() || "";
        const title = r.event?.title?.toLowerCase() || "";
        return email.includes(term) || title.includes(term);
      })
    );
  }, [search, salonReservations, eventReservations]);

  return (
    <section className="container my-5">
      <h1 className="mb-3 text-center fw-bold">Reservas (Admin)</h1>

      <p className="text-center text-muted mb-4">
        Vista general de todas las reservas realizadas en Santos Garden Venue.
      </p>

      {/* Buscador */}
      <div className="row mb-4">
        <div className="col-md-8 mx-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por correo, evento o tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="alert alert-danger text-center">{error}</div>}
      {loading && <p className="text-center">Cargando...</p>}

      {/* ============================= RESERVAS DEL SALÓN ============================= */}
      <h3 className="fw-semibold mt-4">Reservas del Salón</h3>

      <div className="table-responsive mt-2">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Tipo de Evento</th>
              <th>Fecha</th>
              <th>Invitados</th>
              <th>Mensaje</th>
              <th>Fecha de reserva</th>
            </tr>
          </thead>

          <tbody>
            {filteredSalon.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No hay reservas del salón.
                </td>
              </tr>
            ) : (
              filteredSalon.map((r) => (
                <tr key={r._id}>
                  <td>{r.user?.name}</td>
                  <td>{r.user?.email}</td>
                  <td>{r.eventType}</td>
                  <td>{r.date}</td>
                  <td>{r.guests}</td>
                  <td>{r.message}</td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ============================= RESERVAS DE EVENTOS ============================= */}
      <h3 className="fw-semibold mt-5">Reservas de Eventos (Asientos)</h3>

      <div className="table-responsive mt-2">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Evento</th>
              <th>Fecha</th>
              <th>Asientos</th>
              <th>Total (Q)</th>
              <th>Fecha de reserva</th>
            </tr>
          </thead>

          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No hay reservas de eventos.
                </td>
              </tr>
            ) : (
              filteredEvents.map((r) => (
                <tr key={r._id}>
                  <td>{r.user?.name}</td>
                  <td>{r.user?.email}</td>
                  <td>{r.event?.title}</td>
                  <td>{r.event?.date}</td>
                  <td>{r.seats}</td>
                  <td>{r.totalPrice}</td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
