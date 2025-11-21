import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    // Usuario que realiza la reserva
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userEmail: { type: String, required: true },

    // Tipo de reserva: asiento de evento o salón
    type: {
      type: String,
      enum: ["seat", "salon"],
      required: true,
    },

    /* ============================
       Reservas de Eventos (seat)
    ============================ */
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    seats: { type: Number },
    totalPrice: { type: Number },

    /* ============================
       Reservas del Salón
    ============================ */
    eventType: { type: String }, // Tipo de evento (boda, cumpleaños)
    date: { type: String },      // Fecha solicitada
    guests: { type: Number },    // Número de invitados
    message: { type: String },   // Mensaje adicional
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);
