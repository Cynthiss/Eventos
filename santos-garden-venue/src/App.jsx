import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Events from "./pages/Events.jsx";
import Admin from "./pages/Admin.jsx";
import Contact from "./pages/Contact.jsx";
import "./App.css";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container my-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </>
  );
}
