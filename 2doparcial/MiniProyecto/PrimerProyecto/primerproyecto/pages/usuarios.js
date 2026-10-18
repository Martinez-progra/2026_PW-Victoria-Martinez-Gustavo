import { useState, useEffect } from "react";
import Link from "next/link";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("Estudiante");
  const [mensaje, setMensaje] = useState("");

  
  const cargarUsuarios = async () => {
    try {
      const res = await fetch("/api/usuarios");
      const data = await res.json();
      if (data.success) {
        setUsuarios(data.data);
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // 2. Enviar el formulario para registrar un nuevo usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, rol }),
      });

      const data = await res.json();

      if (data.success) {
        setMensaje("¡Usuario registrado con éxito!");
        setNombre("");
        setEmail("");
        cargarUsuarios(); // Recargar la tabla automáticamente
      } else {
        setMensaje(data.message || "Error al registrar el usuario");
      }
    } catch (error) {
      setMensaje("Error de red al conectar con el servidor");
    }
  };

  return (
    <main style={{ padding: "24px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      {/* Barra de navegación directa entre módulos */}
      <nav style={{ marginBottom: "20px", display: "flex", gap: "15px" }}>
        <Link href="/" style={{ color: "#2563eb", fontWeight: "bold" }}>← Inicio</Link>
        <Link href="/usuarios" style={{ color: "#2563eb", fontWeight: "bold" }}>👥 Usuarios</Link>
        <Link href="/talleres" style={{ color: "#16a34a" }}>🛠️ Talleres</Link>
        <Link href="/asistencia" style={{ color: "#9333ea" }}>📋 Asistencia</Link>
      </nav>

      <h1>Gestión de Usuarios</h1>
      <p style={{ color: "#4b5563" }}>Administra y registra los usuarios del sistema.</p>

      {/* Formulario de Registro */}
      <form onSubmit={handleSubmit} style={{ background: "#f3f4f6", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
        <h3>Registrar Nuevo Usuario</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px", marginTop: "10px" }}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ padding: "8px" }}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "8px" }}
          />
          <select value={rol} onChange={(e) => setRol(e.target.value)} style={{ padding: "8px" }}>
            <option value="Estudiante">Estudiante</option>
            <option value="Profesor">Profesor</option>
            <option value="Administrador">Administrador</option>
          </select>
          <button type="submit" style={{ padding: "10px", background: "#2563eb", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}>
            Guardar Usuario
          </button>
        </div>
        {mensaje && <p style={{ marginTop: "10px", fontWeight: "bold", color: "#16a34a" }}>{mensaje}</p>}
      </form>

      {/* Tabla de Resultados */}
      <h3>Lista de Usuarios Registrados</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ background: "#e5e7eb", textAlign: "left" }}>
            <th style={{ padding: "8px", border: "1px solid #d1d5db" }}>ID</th>
            <th style={{ padding: "8px", border: "1px solid #d1d5db" }}>Nombre</th>
            <th style={{ padding: "8px", border: "1px solid #d1d5db" }}>Email</th>
            <th style={{ padding: "8px", border: "1px solid #d1d5db" }}>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((u) => (
              <tr key={u.id}>
                <td style={{ padding: "8px", border: "1px solid #d1d5db" }}>{u.id}</td>
                <td style={{ padding: "8px", border: "1px solid #d1d5db" }}>{u.nombre}</td>
                <td style={{ padding: "8px", border: "1px solid #d1d5db" }}>{u.email}</td>
                <td style={{ padding: "8px", border: "1px solid #d1d5db" }}>{u.rol}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "12px", border: "1px solid #d1d5db", color: "#6b7280" }}>
                No hay usuarios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}