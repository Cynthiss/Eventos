import { useEffect, useState } from "react";
import { api } from "../services/api.js"; // Asegúrate de que tu API funcione correctamente
import { useAuth } from "../context/AuthContext.jsx"; // Usamos el contexto de autenticación

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    date: "",
    place: "",
    price: 0,
    availableSeats: 0, // Lugar disponible para eventos públicos
    peopleLimit: 0,    // Cantidad de personas para eventos privados
    type: "public",    // Tipo de evento
  });
  const [editingId, setEditingId] = useState(null);
  
  // Obtén el estado de autenticación
  const { isAuth } = useAuth();

  // Cargar eventos desde el servicio
  useEffect(() => {
    api.getEvents().then(setEvents);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!editingId) {
      // Crear un nuevo evento
      const created = await api.createEvent(form);
      setEvents((prev) => [created, ...prev]);
    } else {
      // Actualizar evento existente
      const updated = await api.updateEvent(editingId, form);
      setEvents((prev) =>
        prev.map((e) => (e.id === editingId ? updated : e))
      );
    }
    // Limpiar el formulario y cancelar edición
    setForm({ title: "", date: "", place: "", price: 0, availableSeats: 0, peopleLimit: 0, type: "public" });
    setEditingId(null);
  };

  const onDelete = async (id) => {
    await api.deleteEvent(id); // Eliminar evento
    setEvents((prev) => prev.filter((e) => e.id !== id)); // Actualizar lista de eventos
    if (editingId === id) {
      setEditingId(null);
      setForm({ title: "", date: "", place: "", price: 0, availableSeats: 0, peopleLimit: 0, type: "public" });
    }
  };

  const startEdit = (ev) => {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      date: ev.date,
      place: ev.place,
      price: ev.price,
      availableSeats: ev.availableSeats || 0, // Dejar vacío si no es público
      peopleLimit: ev.peopleLimit || 0, // Dejar vacío si no es privado
      type: ev.type,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", date: "", place: "", price: 0, availableSeats: 0, peopleLimit: 0, type: "public" });
  };

  return (
    <section className="my-5">
      <h2 className="mb-3">Panel de Administración</h2>

      {/* Formulario de creación/edición de eventos */}
      <form className="row g-3 mb-4" onSubmit={onSubmit}>
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Título"
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
            className="form-control"
            placeholder="Lugar"
            value={form.place}
            onChange={(e) => setForm({ ...form, place: e.target.value })}
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Precio"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            required={form.type === "public"}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Lugares disponibles"
            value={form.availableSeats}
            onChange={(e) => setForm({ ...form, availableSeats: Number(e.target.value) })}
            required={form.type === "public"}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Limite de personas"
            value={form.peopleLimit}
            onChange={(e) => setForm({ ...form, peopleLimit: Number(e.target.value) })}
            required={form.type === "private"}
          />
        </div>
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
        {events.length === 0 ? (
          <li className="list-group-item">No hay eventos disponibles</li>
        ) : (
          events.map((e) => (
            <li
              key={e.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                <strong>{e.title}</strong> — {e.date} — {e.place} — Q {e.price}{" "}
                — {e.type === "public" ? "Público" : "Privado"}
              </span>
              <div className="d-flex gap-2">
                {e.type === "public" && (
                  <button className="btn btn-sm btn-outline-success">
                    Reservar Asiento
                  </button>
                )}
                {isAuth && ( // Mostrar solo si el usuario es admin
                  <>
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
                  </>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
