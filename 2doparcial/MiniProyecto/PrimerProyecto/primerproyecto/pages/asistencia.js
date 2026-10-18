import { useState, useEffect } from "react";
import Link from "next/link";

export default function AsistenciaPage() {
  const [asistencias, setAsistencias] = useState([]);
  const [usuarioId, setUsuarioId] = useState("");
  const [tallerId, setTallerId] = useState("");
  const [estado, setEstado] = useState("Presente");
  const [mensaje, setMensaje] = useState("");

  const cargarAsistencias = async () => {
    try {
      const res = await fetch("/api/asistencia");
      const data = await res.json();
      if (data.success) setAsistencias(data.data);
    } catch (error) {
      console.error("Error al cargar asistencias:", error);
    }
  };

  useEffect(() => {
    cargarAsistencias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const res = await fetch("/api/asistencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId: Number(usuarioId), tallerId: Number(tallerId), estado }),
      });

      const data = await res.json();
      if (data.success) {
        setMensaje("¡Asistencia registrada con éxito!");
        setUsuarioId("");
        setTallerId("");
        cargarAsistencias();
      } else {
        setMensaje(data.message || "Error al registrar asistencia");
      }
    } catch (error) {
      setMensaje("Error de red al conectar con la API");
    }
  };

  return (
    <main style={{ padding: "24px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      {/* Navegación directa */}
      <nav style={{ marginBottom: "20px", display: "flex", gap: "15px" }}>
        <Link href="/" style={{ color: "#2563eb", fontWeight: "bold" }}>← Inicio</Link>
        <Link href="/usuarios" style={{ color: "#2563eb" }}>👥 Usuarios</Link>
        <Link href="/talleres" style={{ color: "#16a34a" }}>🛠️ Talleres</Link>
        <Link href="/asistencia" style={{ color: "#9333ea", fontWeight: "bold" }}>📋 Asistencia</Link>
      </nav>

      <h1>Control de Asistencia</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ background: "#f3f4f6", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
        <h3>Registrar Asistencia</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px", marginTop: "10px" }}>
          <input
            type="number"
            placeholder="ID del Usuario"
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
            required
            style={{ padding: "8px" }}
          />
          <input
            type="number"
            placeholder="ID del Taller"
            value={tallerId}
            onChange={(e) => setTallerId(e.target.value)}
            required
            style={{ padding: "8px" }}
          />
          <select value={estado} onChange={(e) => setEstado(e.target.value)} style={{ padding: "8px" }}>
            <option value="Presente">Presente</option>
            <option value="Falta">Falta</option>
            <option value="Justificado">Justificado</option>
          </select>
          <button type="submit" style={{ padding: "10px", background: "#9333ea", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}>
            Guardar Asistencia
          </button>
        </div>
        {mensaje && <p style={{ marginTop: "10px", fontWeight: "bold" }}>{mensaje}</p>}
      </form>

      {/* Tabla de Asistencias */}
      <h3>Registros de Asistencia</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ background: "#e5e7eb", textAlign: "left" }}>
            <th style={{ padding: "8px", border: "1px solid #d1d5db" }}>ID</th>
            <th style={{ padding: "8px", border: "1px solid #d1d5db" }}>ID Usuario</th>
            <th style={{ padding: "8px", border: "1px solid #d1d5db" }}>ID Taller</th>
            <th style={{ padding: "8px", border: "1px solid #d1d5db" }}>Fecha</th>
            <th style={{ padding: "8px", border: "1px solid #d1d5db" }}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.map((a) => (
            <tr key={a.id}>
              <td style={{ padding: "8px", border: "1px solid #d1d5db" }}>{a.id}</td>
              <td style={{ padding: "8px", border: "1px solid #d1d5db" }}>{a.usuarioId}</td>
              <td style={{ padding: "8px", border: "1px solid #d1d5db" }}>{a.tallerId}</td>
              <td style={{ padding: "8px", border: "1px solid #d1d5db" }}>{a.fecha}</td>
              <td style={{ padding: "8px", border: "1px solid #d1d5db" }}>{a.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}