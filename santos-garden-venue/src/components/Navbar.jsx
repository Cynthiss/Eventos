import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { isAuth, login, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid px-3">
        <Link className="navbar-brand" to="/">Santos Garden Venue</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav"
          aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/">Inicio</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/events">Eventos</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/contact">Contacto</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/admin">Admin</NavLink></li>
            <li className="nav-item ms-3">
              {isAuth ? (
                <button className="btn btn-outline-light btn-sm" onClick={logout}>Cerrar sesión</button>
              ) : (
                <button className="btn btn-outline-light btn-sm" onClick={login}>Iniciar sesión demo</button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
