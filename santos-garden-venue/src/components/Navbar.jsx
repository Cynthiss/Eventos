// src/components/Navbar.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar-main shadow-sm">
      <div className="navbar-container">

        {/* LOGO */}
        <Link className="navbar-logo" to="/">
          Santos Garden Venue
        </Link>

        {/* LINKS */}
        <ul className="navbar-links">
          <li><NavLink to="/">Inicio</NavLink></li>
          <li><NavLink to="/events">Eventos</NavLink></li>
          <li><NavLink to="/my-reservations">Mis reservas</NavLink></li>
          <li><NavLink to="/contact">Contacto</NavLink></li>


          {user?.role === "admin" && (
            <>
              <li><NavLink to="/admin">Panel admin</NavLink></li>
              <li><NavLink to="/admin/reservations">Reservas (Admin)</NavLink></li>
            </>
          )}
        </ul>

        {user && (
          <div className="navbar-user">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>

            <button className="btn-logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
