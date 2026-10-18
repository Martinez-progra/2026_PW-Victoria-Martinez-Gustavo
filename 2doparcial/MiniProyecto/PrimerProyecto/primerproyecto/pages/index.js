import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <Head>
        <title>Panel de Administración - Talleres</title>
        <meta name="description" content="Sistema de gestión de usuarios, talleres y asistencia" />
      </Head>

      <header style={{ borderBottom: "2px solid #e5e7eb", paddingBottom: "20px", marginBottom: "30px" }}>
        <h1>Panel Principal del Sistema</h1>
        <p style={{ color: "#4b5563" }}>Bienvenido a la  gestión de proyectos escolares.</p>
      </header>

      <section>
        <h2>Módulos del Sistema</h2>
        <p>Selecciona una sección:</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginTop: "20px" }}>
          
          {/* Tarjeta de Usuarios */}
          <div style={{ border: "1px solid #d1d5db", padding: "20px", borderRadius: "8px", background: "#f9fafb" }}>
            <h3>Usuarios</h3>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>Gestión de registros, alumnos y profesores.</p>
            <Link href="/usuarios" style={{ display: "inline-block", marginTop: "10px", padding: "8px 12px", background: "#2563eb", color: "white", textDecoration: "none", borderRadius: "4px" }}>
              Ir a Usuarios
            </Link>
          </div>

          {/* Tarjeta de Talleres */}
          <div style={{ border: "1px solid #d1d5db", padding: "20px", borderRadius: "8px", background: "#f9fafb" }}>
            <h3>Talleres</h3>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>Administración de cursos y cupos disponibles.</p>
            <Link href="/talleres" style={{ display: "inline-block", marginTop: "10px", padding: "8px 12px", background: "#16a34a", color: "white", textDecoration: "none", borderRadius: "4px" }}>
              Ir a Talleres
            </Link>
          </div>

          {/* Tarjeta de Asistencia */}
          <div style={{ border: "1px solid #d1d5db", padding: "20px", borderRadius: "8px", background: "#f9fafb" }}>
            <h3>Asistencia</h3>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>Control de asistencias por usuario y taller.</p>
            <Link href="/asistencia" style={{ display: "inline-block", marginTop: "10px", padding: "8px 12px", background: "#9333ea", color: "white", textDecoration: "none", borderRadius: "4px" }}>
              Ir a Asistencia
            </Link>
          </div>

        </div>
      </section>

      <footer style={{ marginTop: "50px", borderTop: "1px solid #e5e7eb", paddingTop: "15px", fontSize: "12px", color: "#9ca3af", textAlign: "center" }}>
        Proyecto escolar - Arquitectura de Modelos y Controladores en Next.js
      </footer>
    </div>
  );
}