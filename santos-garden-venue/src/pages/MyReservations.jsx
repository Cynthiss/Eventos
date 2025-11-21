// src/pages/MyReservations.jsx
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function MyReservations() {
  const { token, user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .getMyReservations(token)
      .then((data) => setReservations(data))
      .catch(() => setError("No se pudieron cargar tus reservas."))
      .finally(() => setLoading(false));
  }, [token]);

  const salonReservations = reservations.filter((r) => r.type === "salon");
  const eventReservations = reservations.filter(
    (r) => r.type === "seat" || !r.type
  );

  return (
    <section className="container my-5">
      <h1 className="mb-3 text-center fw-bold">Mis reservas</h1>

      {user && (
        <p className="text-center text-muted mb-4">
          Reservas realizadas por: <strong>{user.email}</strong>
        </p>
      )}

      {loading && <p className="text-center">Cargando reservas...</p>}

      {error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

      {/* =================== RESERVAS DEL SALÓN =================== */}
      {salonReservations.length > 0 && (
        <>
          <h3 className="fw-semibold mt-4">Reservas del Salón</h3>

          <div className="reservation-grid mt-3">
            {salonReservations.map((r) => (
              <div key={r._id} className="reservation-card">
                <div className="reservation-title">{r.eventType}</div>

                <p className="reservation-text">
                  <strong>Fecha reservada:</strong> {r.date}
                </p>
                <p className="reservation-text">
                  <strong>Número de invitados:</strong> {r.guests}
                </p>
                <p className="reservation-text">
                  <strong>Mensaje:</strong> {r.message}
                </p>

                <p className="reservation-date">
                  <strong>Fecha de reserva:</strong>{" "}
                  {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* =================== RESERVAS DE EVENTOS =================== */}
      {eventReservations.length > 0 && (
        <>
          <h3 className="fw-semibold mt-5">Reservas de Eventos</h3>

          <div className="reservation-grid mt-3">
            {eventReservations.map((r) => {
              const ev = r.event || {};
              const total =
                r.totalPrice ?? (ev.price || 0) * (r.seats || 0);

              return (
                <div key={r._id} className="reservation-card">
                  <div className="reservation-title">
                    {ev.title || "Evento sin título"}
                  </div>

                  <p className="reservation-text">
                    <strong>Fecha del evento:</strong>{" "}
                    {ev.date || "Sin fecha"}
                  </p>
                  <p className="reservation-text">
                    <strong>Lugar:</strong>{" "}
                    {ev.place || "Santos Garden Venue"}
                  </p>
                  <p className="reservation-text">
                    <strong>Asientos reservados:</strong> {r.seats}
                  </p>
                  <p className="reservation-text">
                    <strong>Total estimado:</strong> Q {total}
                  </p>

                  <p className="reservation-date">
                    <strong>Fecha de reserva:</strong>{" "}
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
