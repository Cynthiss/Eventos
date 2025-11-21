import jwt from "jsonwebtoken";

const JWT_SECRET = "santos_garden_secret_key";  // 👈 IGUAL AL DE AUTH

export default function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token inválido o faltante" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error verificando token:", err);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}
