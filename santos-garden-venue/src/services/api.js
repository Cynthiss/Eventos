// Simulación de backend en memoria
let _events = [
  { id: 1, title: "boda de ana", date: "2026-02-14", place: "Santos Garden", price: 3500 },
  { id: 2, title: "conferencia innovación", date: "2026-03-10", place: "Auditorio UFM", price: 0 },
  { id: 3, title: "fiesta fin de año", date: "2026-12-15", place: "Santos Garden", price: 1200 },
];

const wait = (ms = 300) => new Promise(r => setTimeout(r, ms));

export const api = {
  async getEvents() { await wait(); return [..._events]; },
  // (luego añadiremos create/update/delete)
};
