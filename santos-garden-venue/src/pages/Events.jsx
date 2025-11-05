import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import EventCard from "../components/EventCard.jsx";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEvents().then(data => { setEvents(data); setLoading(false); });
  }, []);

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(q.toLowerCase()) ||
    e.place.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <section className="my-4">
      <h2 className="mb-3">Eventos</h2>

      <input
        className="form-control mb-3"
        placeholder="Buscar por título o lugar…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {loading && <p>Cargando eventos…</p>}
      {!loading && filtered.length === 0 && <p>No hay eventos que coincidan.</p>}
      {!loading && filtered.map(ev => <EventCard key={ev.id} ev={ev} />)}
    </section>
  );
}
