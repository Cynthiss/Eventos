import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import authRouter from "./routes/auth.js";
import eventsRouter from "./routes/events.js";
import reservationsRouter from "./routes/reservations.js";

const app = express();

app.use(cors());
app.use(express.json());

// ===============================
//   CONEXIÓN A MONGODB ATLAS
// ===============================
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB Atlas conectado ✔"))
  .catch((err) =>
    console.error("❌ Error al conectar MongoDB Atlas:", err)
  );

// Rutas
app.use("/auth", authRouter);
app.use("/api/events", eventsRouter);
app.use("/api/reservations", reservationsRouter);

// Puerto
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
