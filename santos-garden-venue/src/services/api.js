const API_URL = "http://localhost:4000/api/events";

export const api = {
  async getEvents() {
    const res = await fetch(API_URL);
    return res.json();
  },

  async createEvent(event) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    return res.json();
  },

  async updateEvent(id, event) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    return res.json();
  },

  async deleteEvent(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    return true;
  }
};
