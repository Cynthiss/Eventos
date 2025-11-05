// --- Persistencia en localStorage ---
const LS_KEY = "sgv_events";

function loadEvents() {
  const raw = localStorage.getItem(LS_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch { /* ignore */ }
  }
  // semilla inicial si no hay nada guardado
  return [
    { id: 1, title: "boda de ana", date: "2026-02-14", place: "Santos Garden", price: 3500 },
    { id: 2, title: "conferencia innovación", date: "2026-03-10", place: "Auditorio UFM", price: 0 },
    { id: 3, title: "fiesta fin de año", date: "2026-12-15", place: "Santos Garden", price: 1200 },
  ];
}

function saveEvents(arr) {
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
}

// estado “global” simulado cargado desde localStorage
let _events = loadEvents();

const wait = (ms = 200) => new Promise(r => setTimeout(r, ms));

export const api = {
  async getEvents() {
    await wait();
    // refresca desde localStorage por si otra vista cambió algo
    _events = loadEvents();
    return [..._events];
  },

  async createEvent(data) {
    await wait();
    const created = { ...data, id: Date.now() };
    _events = [created, ..._events];
    saveEvents(_events);
    return created;
  },

  async deleteEvent(id) {
    await wait();
    _events = _events.filter(e => e.id !== id);
    saveEvents(_events);
    return true;
  },
};
