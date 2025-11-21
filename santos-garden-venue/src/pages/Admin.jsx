import { useState, useEffect } from "react";
import { api } from "../services/api.js";

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    date: "",
    guests: 0,
    price: 0,
    type: "public",
  });
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Token del login
  const token =
    localStorage.getItem("sgv_token") ||
    localStorage.getItem("token") ||
    null;

  // Fecha de hoy en formato YYYY-MM-DD
  const todayStr = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    api.getEvents().then((data) => {
      // Normalizar id a _id y fecha YYYY-MM-DD
      const formatted = data.map((ev) => ({
        ...ev,
        id: ev._id,
        date:
          ev.date && typeof ev.date === "string"
            ? ev.date.slice(0, 10)
            : ev.date,
      }));
      setEvents(formatted);
    });
  }, []);

  // Verificar si la fecha está ocupada por otro evento
  const isDateTaken =
    form.date &&
    events.some((ev) => ev.date === form.date && ev.id !== editingId);

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

    if (!token) {
      setFormError("Debes iniciar sesión como administrador.");
      return;
    }

    if (form.date < todayStr) {
      setFormError("No puedes usar una fecha pasada.");
      return;
    }

    if (isDateTaken) {
      setFormError(`La fecha ${form.date} ya está ocupada.`);
      return;
    }

    try {
      let saved;

      if (!editingId) {
        saved = await api.createEvent(form, token);
        saved = {
          ...saved,
          id: saved._id,
          date: saved.date.slice(0, 10),
        };
        setEvents((prev) => [saved, ...prev]);
        setFormSuccess("Evento creado correctamente ✔️");
      } else {
        saved = await api.updateEvent(editingId, form, token);
        saved = {
          ...saved,
          id: saved._id,
          date: saved.date.slice(0, 10),
        };
        setEvents((prev) =>
          prev.map((e) => (e.id === editingId ? saved : e))
        );
        setFormSuccess("Evento actualizado correctamente ✔️");
      }

      resetForm();
    } catch (err) {
      setFormError(err.message || "Error al guardar el evento");
    }
  };

  const onDelete = async (id) => {
    if (!token) {
      setFormError("Debes iniciar sesión como administrador.");
      return;
    }

    if (!window.confirm("¿Eliminar este evento?")) return;

    try {
      await api.deleteEvent(id, token);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      setFormError(err.message || "Error al eliminar el evento");
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

  const filteredEvents = events.filter((ev) => {
    if (filterType === "public") return ev.type === "public";
    if (filterType === "private") return ev.type === "private";
    return true;
  });

  return (
    <section className="my-5">
      <h2 className="mb-4 text-center">Panel de Administración</h2>

      {!token && (
        <div className="alert alert-warning">
          No has iniciado sesión. Solo podrás ver los eventos.
        </div>
      )}

      {formError && <div className="alert alert-danger">{formError}</div>}
      {formSuccess && <div className="alert alert-success">{formSuccess}</div>}

      {/* FORMULARIO */}
      <form className="mb-4" onSubmit={onSubmit}>
        <div className="row g-3 align-items-end">
          <div className="col-md-6">
            <label className="form-label">Título</label>
            <input
              className="form-control"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              className="form-control"
              value={form.date}
              min={todayStr}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
              required
            />
            {isDateTaken && (
              <small className="text-danger">
                Ya existe un evento en esta fecha
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

        {/* FILA 2 */}
        <div className="row g-3 align-items-end mt-1">
          <div className="col-md-3">
            <label className="form-label">
              {form.type === "public"
                ? "Asientos disponibles"
                : "Invitados"}
            </label>
            <input
              type="number"
              className="form-control"
              value={form.guests}
              min="0"
              onChange={(e) =>
                setForm({ ...form, guests: Number(e.target.value) })
              }
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Precio (Q)</label>
            <input
              type="number"
              className="form-control"
              value={form.price}
              min="0"
              disabled={form.type === "private"}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Tipo</label>
            <select
              className="form-select"
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
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
                Cancelar
              </button>
            </div>
          )}
        </div>
      </form>

      <hr className="my-4" />

      {/* FILTRO */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="mb-0">Eventos registrados</h5>
          <small className="text-muted">
            Total: {events.length} · Mostrando: {filteredEvents.length}
          </small>
        </div>

        <div className="btn-group">
          <button
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

      {/* LISTA */}
      {filteredEvents.length === 0 ? (
        <p className="text-muted">No hay eventos.</p>
      ) : (
        <ul className="list-group">
          {filteredEvents.map((e) => (
            <li
              key={e.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{e.title}</strong>{" "}
                <span className="badge bg-light text-dark ms-2">
                  {e.date}
                </span>

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
