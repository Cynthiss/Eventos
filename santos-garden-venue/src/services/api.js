const API_URL = "http://localhost:4000/api/events";

// Función para normalizar el objeto que viene de Mongo
const normalizeEvent = (ev) => ({
  id: ev._id || ev.id,
  title: ev.title,
  date: ev.date,
  guests: ev.guests,
  price: ev.price,
  type: ev.type,
});

export const api = {
  async getEvents() {
    const res = await fetch(API_URL);
    const data = await res.json();
    // Devolvemos todos los eventos ya normalizados
    return data.map(normalizeEvent);
  },

  async createEvent(event) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    const data = await res.json();
    // Normalizamos el creado
    return normalizeEvent(data);
  },

  async updateEvent(id, event) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    const data = await res.json();
    // Normalizamos el actualizado
    return normalizeEvent(data);
  },

  async deleteEvent(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    return true;
  },
};
