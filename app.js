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
