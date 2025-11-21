// fixReservations.js
import mongoose from "mongoose";

// === Conectar a la base REAL de tu backend ===
const MONGO_URI = "mongodb://127.0.0.1:27017/santos_garden";

// ===== Conectar =====
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB conectado ✔ (santos_garden)");
  } catch (err) {
    console.error("Error conectando a MongoDB ❌", err);
    process.exit(1);
  }
}

// ===== MODELO TEMPORAL (strict:false para evitar errores) =====
const Reservation = mongoose.model(
  "Reservation",
  new mongoose.Schema(
    {
      type: String,
      eventType: String,
      event: mongoose.Types.ObjectId,
    },
    { strict: false }
  ),
  "reservations" // nombre de la colección
);

// ===== FIX LOGIC =====
async function fixReservations() {
  await connectDB();

  console.log("\n=== Corrigiendo reservas antiguas… ===");

  // 1️⃣ SALÓN
  const salonFix = await Reservation.updateMany(
    { type: { $exists: false }, eventType: { $exists: true } },
    { $set: { type: "salon" } }
  );
  console.log(`✔ Salon actualizados: ${salonFix.modifiedCount}`);

  // 2️⃣ ASIENTOS
  const seatFix = await Reservation.updateMany(
    { type: { $exists: false }, event: { $exists: true } },
    { $set: { type: "seat" } }
  );
  console.log(`✔ Seat actualizados: ${seatFix.modifiedCount}`);

  // 3️⃣ FALLBACK
  const fallbackFix = await Reservation.updateMany(
    { type: { $exists: false } },
    { $set: { type: "seat" } }
  );
  console.log(`✔ Fallback aplicados: ${fallbackFix.modifiedCount}`);

  console.log("\n🎉 Arreglo completado EN santos_garden ✔");
  process.exit(0);
}

fixReservations();
