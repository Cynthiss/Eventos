import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
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
        </ul>
      </div>
    </nav>
  );
}
