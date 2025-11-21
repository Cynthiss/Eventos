import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function Contact() {
  const { user, token } = useAuth();

  const [form, setForm] = useState({
    eventType: "",
    date: "",
    guests: "",
    message: ""
  });

  const [status, setStatus] = useState("");
  const [reservedDates, setReservedDates] = useState([]);

  // Obtener fechas ocupadas del backend
  useEffect(() => {
    const loadDates = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/reservations/salon/dates");
        const data = await res.json();
        setReservedDates(data);
      } catch (err) {
        console.error("Error cargando fechas:", err);
      }
    };

    loadDates();
  }, []);

  // Fecha mínima (hoy)
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "date") {
      const selected = e.target.value;

      if (reservedDates.includes(selected)) {
        setStatus("Esta fecha ya está reservada. Selecciona otra.");
      } else {
        setStatus("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setStatus("Debes iniciar sesión para completar la reserva.");
      return;
    }

    if (reservedDates.includes(form.date)) {
      setStatus("Esta fecha ya está reservada. Selecciona otra.");
      return;
    }

    try {
      await api.createSalonReservation(form, token);
      setStatus("¡Reserva enviada correctamente! Nos contactaremos contigo pronto.");

      setForm({ eventType: "", date: "", guests: "", message: "" });
    } catch (err) {
      setStatus(err.message);
    }
  };

  // Determinar si una fecha debe deshabilitarse
  const isDateDisabled = (date) => {
    return reservedDates.includes(date);
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold">Reservar el Salón</h2>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">

          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4">

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Tipo de Evento</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="eventType"
                    value={form.eventType}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Fecha para Reservar</label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    name="date"
                    min={today}
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                  {isDateDisabled(form.date) && (
                    <small className="text-danger">
                      Esta fecha ya está reservada.
                    </small>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Número de Invitados</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="guests"
                    value={form.guests}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Mensaje</label>
                  <textarea
                    className="form-control form-control-lg"
                    rows="5"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button className="btn btn-primary btn-lg w-100 rounded-pill">
                  Enviar Reserva
                </button>
              </form>

              {status && (
                <div className="alert alert-info mt-4 text-center fw-semibold">
                  {status}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
