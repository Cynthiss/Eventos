import express from "express";
import Event from "../models/Event.js";
import Reservation from "../models/Reservation.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* ============================================
   OBTENER FECHAS YA RESERVADAS DEL SALÓN
   (reservas que NO tienen "event")
============================================ */
router.get("/salon/dates", async (req, res) => {
  try {
    const dates = await Reservation.find({ event: { $exists: false } })
      .select("date -_id");

    const formatted = dates.map((d) => d.date);
    res.json(formatted);
  } catch (err) {
    console.error("Error obteniendo fechas del salón:", err);
    res.status(500).json({ message: "Error al obtener fechas reservadas" });
  }
});

/* ============================================
   RESERVA DEL SALÓN
============================================ */
router.post("/salon", auth, async (req, res) => {
  try {
    const { eventType, date, guests, message } = req.body;

    if (!eventType || !date || !guests) {
      return res.status(400).json({ message: "Faltan datos para la reserva" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // validar fecha ya reservada
    const exists = await Reservation.findOne({
      date,
      event: { $exists: false },
    });

    if (exists) {
      return res.status(400).json({
        message: "Esta fecha ya está reservada. Selecciona otra.",
      });
    }

    const reservation = await Reservation.create({
      user: user._id,
      userEmail: user.email,
      type: "salon",        // <-- agregado siempre
      eventType,
      date,
      guests,
      message,
    });

    res.status(201).json({
      message: "Reserva del salón creada",
      reservation,
    });
  } catch (err) {
    console.error("Error reserva salón:", err);
    res.status(500).json({ message: "Error al crear la reserva del salón" });
  }
});

/* ============================================
   RESERVA DE ASIENTOS EN EVENTOS
============================================ */
router.post("/", auth, async (req, res) => {
  try {
    const { eventId, seats } = req.body;
    const userId = req.user.id;

    if (!eventId || !seats) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Evento no encontrado" });

    if (event.guests < seats) {
      return res.status(400).json({
        message: "No hay suficientes asientos disponibles",
      });
    }

    const totalPrice = (event.price || 0) * seats;

    const reservation = await Reservation.create({
      user: userId,
      userEmail: user.email,
      type: "seat",         // <-- agregado
      event: eventId,
      seats,
      totalPrice,
    });

    event.guests -= seats;
    await event.save();

    res.json({
      message: "Reserva creada",
      reservation,
      updatedEvent: event,
    });
  } catch (err) {
    console.error("Error en reserva:", err);
    res.status(500).json({ message: "Error al crear la reserva" });
  }
});

/* ============================================
   RESERVAS DEL USUARIO
============================================ */
router.get("/my", auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate("event");

    res.json(reservations);
  } catch (err) {
    console.error("Error al obtener reservas:", err);
    res.status(500).json({ message: "Error al obtener reservas" });
  }
});

/* ============================================
   TODAS LAS RESERVAS (ADMIN)
============================================ */
router.get("/all", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "No autorizado" });
    }

    // Traer TODAS las reservas
    const allReservations = await Reservation.find()
      .populate("event")
      .populate("user", "name email");

    // Clasificación automática SIN depender de "type"
    const salonReservations = allReservations.filter((r) => !r.event);
    const eventReservations = allReservations.filter((r) => r.event);

    res.json({
      salonReservations,
      eventReservations,
    });
  } catch (err) {
    console.error("Error al obtener TODAS las reservas:", err);
    res.status(500).json({ message: "Error al obtener reservas" });
  }
});

export default router;
