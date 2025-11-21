// 🔥 URL de backend en Render
const API_BASE = "https://santosgarden.onrender.com";

export const api = {
  // =====================================
  //               EVENTOS
  // =====================================
  async getEvents() {
    const res = await fetch(`${API_BASE}/api/events`);
    if (!res.ok) throw new Error("Error al cargar eventos");
    return res.json();
  },

  async createEvent(event, token) {
    const res = await fetch(`${API_BASE}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(event),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Error al crear evento");
    }

    return res.json();
  },

  async updateEvent(id, event, token) {
    const res = await fetch(`${API_BASE}/api/events/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(event),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Error al actualizar evento");
    }

    return res.json();
  },

  async deleteEvent(id, token) {
    const res = await fetch(`${API_BASE}/api/events/${id}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Error al eliminar evento");
    }

    return true;
  },

  // =====================================
  //   RESERVA DEL SALÓN (CONTACT PAGE)
  // =====================================
  async createSalonReservation(data, token) {
    const res = await fetch(`${API_BASE}/api/reservations/salon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Error al crear la reserva del salón");
    }

    return res.json();
  },

  // =====================================
  //  RESERVAS PARA EVENTOS (ASIENTOS)
  // =====================================
  async createReservation(eventId, seats, token) {
    const res = await fetch(`${API_BASE}/api/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ eventId, seats }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Error al crear la reserva");
    }

    return res.json();
  },

  async getMyReservations(token) {
    const res = await fetch(`${API_BASE}/api/reservations/my`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Error al obtener reservas");
    }

    return res.json();
  },

  async getAllReservations(token) {
    const res = await fetch(`${API_BASE}/api/reservations/all`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Error al obtener todas las reservas");
    }

    return res.json();
  },

  // =====================================
  //              LOGIN
  // =====================================
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Error en login");

    return res.json();
  },
};
