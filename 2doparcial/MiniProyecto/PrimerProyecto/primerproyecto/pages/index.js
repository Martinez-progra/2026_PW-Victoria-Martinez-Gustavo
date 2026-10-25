import Link from 'next/link';
import estilos from '../styles/Dashboard.module.css';

const modulos = [
  {
    titulo: 'Usuarios',
    descripcion: 'Gestión de registros, alumnos y profesores.',
    textoEnlace: 'Ir a Usuarios',
    href: '/alumnos/perfil',
    color: 'usuarios'
  },
  {
    titulo: 'Talleres',
    descripcion: 'Administración de cursos y cupos disponibles.',
    textoEnlace: 'Ir a Talleres',
    href: '/talleres',
    color: 'talleres'
  },
  {
    titulo: 'Asistencia',
    descripcion: 'Control de asistencias por usuario y taller.',
    textoEnlace: 'Ir a Asistencia',
    href: '/talleres/alumnos/perfil',
    color: 'asistencia'
  }
];

export default function Home() {
  return (
    <main className={estilos.contenedor}>
      <header className={estilos.encabezado}>
        <h1>Panel Principal del Sistema</h1>
        <p>Bienvenido a la gestión de proyectos escolares.</p>
      </header>

      <section className={estilos.modulos}>
        <h2>Módulos del Sistema</h2>
        <p>Selecciona una sección:</p>

        <div className={estilos.tarjetas}>
          {modulos.map((modulo) => (
            <article className={estilos.tarjeta} key={modulo.titulo}>
              <h3>{modulo.titulo}</h3>
              <p>{modulo.descripcion}</p>
              <Link
                className={`${estilos.boton} ${estilos[modulo.color]}`}
                href={modulo.href}
              >
                {modulo.textoEnlace}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <footer className={estilos.pie}>
        Proyecto escolar - Arquitectura de Modelos y Controladores en Next.js
      </footer>
    </main>
  );
}
