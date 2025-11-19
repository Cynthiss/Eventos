import { useState, useEffect } from "react";
import { api } from "../services/api.js";

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    date: "",
    guests: 0,
    price: 0,
    type: "public", // público o privado
  });
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [filterType, setFilterType] = useState("all"); // all | public | private

  // Hoy en formato YYYY-MM-DD
  const todayStr = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    api.getEvents().then(setEvents);
  }, []);

  // ¿La fecha ya está ocupada por otro evento?
  const isDateTaken =
    form.date &&
    events.some(
      (ev) => ev.date === form.date && ev.id !== editingId
    );

  const resetForm = () => {
    setForm({
      title: "",
      date: "",
      guests: 0,
      price: 0,
      type: "public",
    });
    setEditingId(null);
    setFormError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    // Fecha pasada
    if (form.date < todayStr) {
      setFormError("No puedes crear o editar un evento con una fecha pasada.");
      return;
    }

    // Fecha ocupada
    if (isDateTaken) {
      setFormError(
        `La fecha ${form.date} ya tiene un evento programado. Elige otra fecha.`
      );
      return;
    }

    if (!editingId) {
      const created = await api.createEvent(form);
      setEvents((prev) => [created, ...prev]);
      setFormSuccess("Evento creado correctamente ✔️");
    } else {
      const updated = await api.updateEvent(editingId, form);
      setEvents((prev) =>
        prev.map((e) => (e.id === editingId ? updated : e))
      );
      setFormSuccess("Cambios guardados correctamente ✔️");
    }

    resetForm();
  };

  const onDelete = async (id) => {
    await api.deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    if (editingId === id) {
      resetForm();
      setFormSuccess("");
    }
  };

  const startEdit = (ev) => {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      date: ev.date,
      guests: ev.guests,
      price: ev.price || 0,
      type: ev.type,
    });
    setFormError("");
    setFormSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    resetForm();
    setFormSuccess("");
  };

  // ===========================
  // FILTRO DE EVENTOS
  // ===========================
  const filteredEvents = events.filter((ev) => {
    if (filterType === "public") return ev.type === "public";
    if (filterType === "private") return ev.type === "private";
    return true; // all
  });

  return (
    <section className="my-5">
      <h2 className="mb-4 text-center">Panel de Administración</h2>

      {/* Mensajes globales */}
      {formError && (
        <div className="alert alert-danger" role="alert">
          {formError}
        </div>
      )}
      {formSuccess && (
        <div className="alert alert-success" role="alert">
          {formSuccess}
        </div>
      )}

      {/* FORMULARIO */}
      <form className="mb-4" onSubmit={onSubmit}>
        <div className="row g-3 align-items-end">
          {/* Fila 1: título + fecha + botón */}
          <div className="col-md-6">
            <label className="form-label">Título del evento</label>
            <input
              className="form-control"
              placeholder="Ej. Convivio, Conferencia UFM..."
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                setFormError("");
                setFormSuccess("");
              }}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Fecha del evento</label>
            <input
              type="date"
              className="form-control"
              value={form.date}
              min={todayStr}
              onChange={(e) => {
                setForm({ ...form, date: e.target.value });
                setFormError("");
                setFormSuccess("");
              }}
              required
            />
            {form.date && isDateTaken && (
              <small className="text-danger">
                Ya existe un evento en esta fecha.
              </small>
            )}
          </div>

          <div className="col-md-3 d-flex align-items-end">
            <button
              className="btn btn-success w-100"
              type="submit"
              disabled={isDateTaken}
            >
              {editingId ? "Guardar cambios" : "Crear evento"}
            </button>
          </div>
        </div>

        {/* Fila 2: asientos/invitados + precio + tipo + cancelar */}
        <div className="row g-3 align-items-end mt-1">
          <div className="col-md-3">
            <label className="form-label">
              {form.type === "public"
                ? "Asientos disponibles"
                : "Número de invitados"}
            </label>
            <input
              type="number"
              className="form-control"
              min="0"
              placeholder={form.type === "public" ? "Ej. 45" : "Ej. 80"}
              value={form.guests}
              onChange={(e) =>
                setForm({ ...form, guests: Number(e.target.value) })
              }
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Precio por entrada (Q)</label>
            <input
              type="number"
              className="form-control"
              min="0"
              placeholder="Ej. 100"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
              required={form.type === "public"}
              disabled={form.type === "private"}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Tipo de evento</label>
            <select
              className="form-select"
              value={form.type}
              onChange={(e) => {
                setForm({ ...form, type: e.target.value });
                setFormError("");
                setFormSuccess("");
              }}
              required
            >
              <option value="public">Público</option>
              <option value="private">Privado</option>
            </select>
          </div>

          {editingId && (
            <div className="col-md-3 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={cancelEdit}
              >
                Cancelar edición
              </button>
            </div>
          )}
        </div>
      </form>

      <hr className="my-4" />

      {/* RESUMEN + FILTRO */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div className="mb-2 mb-md-0">
          <h5 className="mb-0">Eventos registrados</h5>
          <small className="text-muted">
            Total: {events.length}{" "}
            {events.length === 1 ? "evento" : "eventos"} · Mostrando{" "}
            {filteredEvents.length}
          </small>
        </div>

        <div className="btn-group" role="group" aria-label="Filtro eventos">
          <button
            type="button"
            className={`btn btn-sm ${
              filterType === "all"
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => setFilterType("all")}
          >
            Todos
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              filterType === "public"
                ? "btn-success"
                : "btn-outline-success"
            }`}
            onClick={() => setFilterType("public")}
          >
            Públicos
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              filterType === "private"
                ? "btn-secondary"
                : "btn-outline-secondary"
            }`}
            onClick={() => setFilterType("private")}
          >
            Privados
          </button>
        </div>
      </div>

      {/* LISTA DE EVENTOS (FILTRADOS) */}
      {filteredEvents.length === 0 ? (
        <p className="text-muted">No hay eventos para este filtro.</p>
      ) : (
        <ul className="list-group">
          {filteredEvents.map((e) => (
            <li
              key={e.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <div>
                  <strong>{e.title}</strong>{" "}
                  <span className="badge bg-light text-dark ms-2">
                    {e.date}
                  </span>
                </div>
                <small className="text-muted d-block mt-1">
                  {e.type === "public" ? (
                    <>
                      <span className="badge bg-primary me-2">
                        Público
                      </span>
                      Q {e.price} · {e.guests} asientos
                    </>
                  ) : (
                    <>
                      <span className="badge bg-dark me-2">
                        Privado
                      </span>
                      {e.guests} invitados
                    </>
                  )}
                </small>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => startEdit(e)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete(e.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
