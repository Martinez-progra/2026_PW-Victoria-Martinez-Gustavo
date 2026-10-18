import { useState, useEffect } from "react";
import Link from "next/link";

export default function TalleresPage() {
  const [talleres, setTalleres] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cupo, setCupo] = useState(20);
  const [mensaje, setMensaje] = useState("");

  const cargarTalleres = async () => {
    try {
      const res = await fetch("/api/talleres");
      const data = await res.json();
      if (data.success) setTalleres(data.data);
    } catch (error) {
      console.error("Error al cargar talleres:", error);
    }
  };

  useEffect(() => {
    cargarTalleres();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const res = await fetch("/api/talleres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, cupo: Number(cupo) }),
      });

      const data = await res.json();
      if (data.success) {
        setMensaje("¡Taller registrado con éxito!");
        setNombre("");
        setDescripcion("");
        cargarTalleres();
      } else {
        setMensaje(data.message || "Error al registrar taller");
      }
    } catch (error) {
      setMensaje("Error al conectar con la API");
    }
  };

  return (
    <main style={{ padding: "24px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      {/* Navegación directa */}
      <nav style={{ marginBottom: "20px", display: "flex", gap: "15px" }}>
        <Link href="/" style={{ color: "#2563eb", fontWeight: "bold" }}>← Inicio</Link>
        <Link href="/usuarios" style={{ color: "#2563eb" }}>👥 Usuarios</Link>
        <Link href="/talleres" style={{ color: "#16a34a", fontWeight: "bold" }}>🛠️ Talleres</Link>
        <Link href="/asistencia" style={{ color: "#9333ea" }}>📋 Asistencia</Link>
      </nav>

      <h1>Gestión de Talleres</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ background: "#f3f4f6", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
        <h3>Registrar Nuevo Taller</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px", marginTop: "10px" }}>
          <input
            type="text"
            placeholder="Nombre del taller"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ padding: "8px" }}
          />
          <input
            type="text"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            style={{ padding: "8px" }}
          />
          <input
            type="number"
            placeholder="Cupo máximo"
            value={cupo}
            onChange={(e) => setCupo(e.target.value)}
            required
            style={{ padding: "8px" }}
          />
          <button type="submit" style={{ padding: "10px", background: "#16a34a", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}>
            Guardar Taller
          </button>
        </div>
        {mensaje && <p style={{ marginTop: "10px", fontWeight: "bold" }}>{mensaje}</p>}
      </form>

      {/* Tabla de Talleres */}
      <h3>Lista de Talleres Disponibles</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ background: "#e5e7eb", textAlign: "left" }}>
            <th style={{ padding: "8px", border: "1px solid #d1d5db" }}>ID</th>
            <th style={{ padding: "8px", border: "1px solid #d1d5db" }}>Nombre</th>
            <th style={{ padding: "8px", border: "1px solid #d1d5db" }}>Descripción</th>
            <th style={{ padding: "8px", border: "1px solid #d1d5db" }}>Cupo</th>
          </tr>
        </thead>
        <tbody>
          {talleres.map((t) => (
            <tr key={t.id}>
              <td style={{ padding: "8px", border: "1px solid #d1d5db" }}>{t.id}</td>
              <td style={{ padding: "8px", border: "1px solid #d1d5db" }}>{t.nombre}</td>
              <td style={{ padding: "8px", border: "1px solid #d1d5db" }}>{t.descripcion}</td>
              <td style={{ padding: "8px", border: "1px solid #d1d5db" }}>{t.cupo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}