import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// --- Configuración ---
const app = express();
app.use(cors());
app.use(express.json());

// --- Conexión a MongoDB ---
mongoose
  .connect("mongodb://localhost:27017/santos_garden")
  .then(() => console.log("MongoDB conectado ✔"))
  .catch((err) => console.error("Error en MongoDB:", err));

// --- Modelo de evento ---
const eventSchema = new mongoose.Schema({
  title: String,
  date: String,
  place: String,
  guests: Number,
  price: Number,
  type: String, // "public" o "private"
});

const Event = mongoose.model("Event", eventSchema);

// --- ENDPOINTS REST ---
// Obtener todos los eventos
app.get("/api/events", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Crear evento
app.post("/api/events", async (req, res) => {
  const event = new Event(req.body);
  await event.save();
  res.json(event);
});

// Actualizar evento
app.patch("/api/events/:id", async (req, res) => {
  const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// Eliminar evento
app.delete("/api/events/:id", async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Evento eliminado" });
});

// --- Iniciar servidor ---
app.listen(4000, () => console.log("API escuchando en http://localhost:4000"));
