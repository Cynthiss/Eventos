import { useState, useEffect } from "react";
import { api } from "../services/api.js"; // Asegúrate de que tu API esté configurada correctamente

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    date: "",
    guests: 0,
    price: 0,
    type: "public", // Para determinar si es público o privado
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    api.getEvents().then(setEvents);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!editingId) {
      const created = await api.createEvent(form);
      setEvents((prev) => [created, ...prev]);
    } else {
      const updated = await api.updateEvent(editingId, form);
      setEvents((prev) =>
        prev.map((e) => (e.id === editingId ? updated : e))
      );
    }
    setForm({ title: "", date: "", guests: 0, price: 0, type: "public" });
    setEditingId(null);
  };

  const onDelete = async (id) => {
    await api.deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm({ title: "", date: "", guests: 0, price: 0, type: "public" });
    }
  };

  const startEdit = (ev) => {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      date: ev.date,
      guests: ev.guests,
      price: ev.price || 0,
      type: ev.type, // asegurarse de que el tipo se cargue también
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", date: "", guests: 0, price: 0, type: "public" });
  };

  return (
    <section className="my-5">
      <h2 className="mb-3">Panel de Administración</h2>

      {/* Formulario para crear/editar evento */}
      <form className="row g-3 mb-4" onSubmit={onSubmit}>
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Título del evento"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Cantidad de invitados"
            value={form.guests}
            onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
            required
          />
        </div>

        {/* Campo adicional de precio solo cuando es un evento público */}
        {form.type === "public" && (
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Precio de la entrada (Ej. 120)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              required
            />
          </div>
        )}

        <div className="col-md-2">
          {/* Selector de tipo de evento */}
          <select
            className="form-select"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            required
          >
            <option value="public">Público</option>
            <option value="private">Privado</option>
          </select>
        </div>
        <div className="col-md-1 d-flex gap-2">
          <button className="btn btn-primary w-100" type="submit">
            {editingId ? "Guardar" : "Crear"}
          </button>
        </div>
        {editingId && (
          <div className="col-12">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={cancelEdit}
            >
              Cancelar edición
            </button>
          </div>
        )}
      </form>

      {/* Lista de eventos */}
      <ul className="list-group">
        {events.map((e) => (
          <li
            key={e.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              <strong>{e.title}</strong> — {e.date} — {e.place} — Q {e.price}{" "}
              — {e.type === "public" ? "Público" : "Privado"} —{" "}
              {e.type === "public" ? `${e.guests} asientos` : `${e.guests} invitados`}
            </span>
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
    </section>
  );
}
