import { useEffect, useState } from "react";
import { api } from "../services/api.js";

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", date: "", place: "", price: 0 });
  const [editingId, setEditingId] = useState(null); // null = creando, id = editando

  useEffect(() => { api.getEvents().then(setEvents); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!editingId) {
      const created = await api.createEvent(form);
      setEvents(prev => [created, ...prev]);
    } else {
      const updated = await api.updateEvent(editingId, form);
      setEvents(prev => prev.map(e => e.id === editingId ? updated : e));
    }
    setForm({ title: "", date: "", place: "", price: 0 });
    setEditingId(null);
  };

  const onDelete = async (id) => {
    await api.deleteEvent(id);
    setEvents(prev => prev.filter(e => e.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm({ title: "", date: "", place: "", price: 0 });
    }
  };

  const startEdit = (ev) => {
    setEditingId(ev.id);
    setForm({ title: ev.title, date: ev.date, place: ev.place, price: ev.price });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", date: "", place: "", price: 0 });
  };

  return (
    <section className="my-5">
      <h2 className="mb-3">Panel de Administración</h2>

      {/* Formulario crear/editar */}
      <form className="row g-3 mb-4" onSubmit={onSubmit}>
        <div className="col-md-3">
          <input className="form-control" placeholder="Título"
            value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} required />
        </div>
        <div className="col-md-3">
          <input type="date" className="form-control"
            value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} required />
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Lugar"
            value={form.place} onChange={(e)=>setForm({...form,place:e.target.value})} required />
        </div>
        <div className="col-md-2">
          <input type="number" className="form-control" placeholder="Precio"
            value={form.price} onChange={(e)=>setForm({...form,price:Number(e.target.value)})} required />
        </div>
        <div className="col-md-1 d-flex gap-2">
          <button className="btn btn-primary w-100" type="submit">
            {editingId ? "Guardar" : "Crear"}
          </button>
        </div>
        {editingId && (
          <div className="col-12">
            <button type="button" className="btn btn-outline-secondary" onClick={cancelEdit}>
              Cancelar edición
            </button>
          </div>
        )}
      </form>

      {/* Lista */}
      <ul className="list-group">
        {events.map((e) => (
          <li key={e.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span><strong>{e.title}</strong> — {e.date} — {e.place} — Q {e.price}</span>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(e)}>Editar</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(e.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
