import { useEffect, useState } from "react";
import { api } from "../services/api.js";

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", date: "", place: "", price: 0 });

  useEffect(() => {
    api.getEvents().then(setEvents);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const created = await api.createEvent(form);
    setEvents((prev) => [created, ...prev]);
    setForm({ title: "", date: "", place: "", price: 0 });
  };

  const onDelete = async (id) => {
    await api.deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <section className="my-5">
      <h2 className="mb-3">Panel de Administración</h2>

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
        <div className="col-md-1">
          <button className="btn btn-primary w-100" type="submit">Crear</button>
        </div>
      </form>

      <ul className="list-group">
        {events.map((e) => (
          <li key={e.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{e.title} — {e.date} — {e.place}</span>
            <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(e.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
