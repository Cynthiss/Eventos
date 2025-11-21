import { currency, formatDate, titleCase } from "../utils/pipes.js";

export default function EventCard({ ev }) {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{titleCase(ev.title)}</h5>
        <p className="card-text mb-1"><strong>Fecha:</strong> {formatDate(ev.date)}</p>
        <p className="card-text mb-1"><strong>Lugar:</strong> {ev.place}</p>
        <p className="card-text"><strong>Precio:</strong> {currency(ev.price)}</p>
        <button className="btn btn-primary">Reservar</button>
      </div>
    </div>
  );
}
