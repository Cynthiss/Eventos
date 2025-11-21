// src/pages/Home.jsx
export default function Home() {
  return (
    <div className="home-container">
      
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Bienvenidos a Santos Garden Venue</h1>
          <p className="hero-subtitle">
            El lugar perfecto para tus eventos especiales. Desde bodas,
            conferencias, hasta fiestas inolvidables.
          </p>

          <a href="/events" className="btn btn-primary hero-btn">
            Ver disponibilidad
          </a>
        </div>

       <img
        src="https://www.guatemala.com/fotos/2020/03/Jardin-los-eucaliptos-885x500.jpg"
        alt="Santos Garden Venue"
        className="hero-image"
      />

      </section>

      {/* Servicios */}
      <section className="features">
        <h2 className="section-title">¿Qué ofrecemos?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🎉</span>
            <h3>Eventos Sociales</h3>
            <p>Bodas, cumpleaños, convivios y eventos familiares.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🏢</span>
            <h3>Eventos Corporativos</h3>
            <p>Conferencias, seminarios y capacitaciones empresariales.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🌳</span>
            <h3>Salón & Jardín</h3>
            <p>Ambientes amplios, elegantes y rodeados de naturaleza.</p>
          </div>
        </div>
      </section>

      {/* CTA inferior */}
      <section className="cta">
        <h2>¿Listo para reservar tu fecha?</h2>
        <p>Consulta disponibilidad y asegura tu espacio.</p>

        <a href="/events" className="btn btn-primary cta-btn">
          Ver eventos disponibles
        </a>
      </section>
    </div>
  );
}
