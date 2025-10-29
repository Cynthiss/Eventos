// Verificar si el usuario ya tiene una preferencia de tema guardada
if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    document.getElementById("darkModeButton").textContent = "🌞";  // Cambiar ícono a sol si está en modo oscuro
}

// Alternar entre modo claro y oscuro
function toggleDarkMode() {
    var body = document.body;
    body.classList.toggle("dark-mode");

    // Guardar la preferencia del usuario
    var isDarkMode = body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDarkMode);

    // Cambiar el ícono del botón según el modo
    var button = document.getElementById("darkModeButton");
    if (isDarkMode) {
        button.textContent = "🌞";  // Sol (modo claro)
    } else {
        button.textContent = "🌙";  // Luna (modo oscuro)
    }
}

// Botón de modo oscuro: Agregar el evento de clic para activar/desactivar el modo oscuro
document.getElementById("darkModeButton").addEventListener("click", toggleDarkMode);



// === SISTEMA DE RESERVA DE FECHA DEL SALÓN ===

// Creamos un arreglo para almacenar las fechas ya reservadas
const reservedDates = [];

// Función para verificar si la fecha seleccionada está disponible
function isDateAvailable(date) {
    return !reservedDates.includes(date);  // Verifica si la fecha ya está en el arreglo
}

// Función para reservar la fecha
function reserveDate() {
    const selectedDate = document.getElementById("eventDate").value;
    const statusMessage = document.getElementById("dateStatus");

    if (selectedDate) {
        if (isDateAvailable(selectedDate)) {
            reservedDates.push(selectedDate);  // Guardamos la fecha en el arreglo de fechas reservadas
            statusMessage.textContent = `🎉 ¡La fecha ${selectedDate} ha sido reservada exitosamente!`;
            statusMessage.style.color = "green";
        } else {
            statusMessage.textContent = `❌ Lo siento, la fecha ${selectedDate} ya está reservada.`;
            statusMessage.style.color = "red";
        }
    } else {
        statusMessage.textContent = "⚠️ Por favor, selecciona una fecha.";
        statusMessage.style.color = "orange";
    }
}

// Agregar el evento de clic para el botón "Reservar Fecha"
document.getElementById("reserveDate").addEventListener("click", reserveDate);


// === CONFIRMACIÓN FORMULARIO CONTACTO ===
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();                        // evita recarga / salto al inicio

  const status = document.getElementById("contactStatus");
  status.textContent = "✅ Se ha enviado correctamente tu correo.";
  status.style.color = "green";
  status.style.fontWeight = "600";

  // opcional: limpiar campos
  this.reset();

  // opcional: ocultar mensaje luego de 5s
  setTimeout(() => (status.textContent = ""), 5000);
});

