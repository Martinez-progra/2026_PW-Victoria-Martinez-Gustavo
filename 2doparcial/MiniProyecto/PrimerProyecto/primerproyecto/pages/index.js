import Link from 'next/link';
import estilos from '../styles/Talleres.module.css';

export default function Home() {
  return (
    <>
      <nav className={estilos.navegacion} aria-label="Navegación principal">
        <Link href="/">Inicio</Link>
        <Link href="/mini-servidor/1">Mini-servidor</Link>
        <Link href="/talleres">Talleres</Link>
        <Link href="/alumnos/perfil">Usuarios</Link>
        <Link href="/talleres/alumnos/perfil">Asistencia</Link>
      </nav>

      <main className={estilos.inicio}>
        <header className={`${estilos.panel} ${estilos.bienvenida}`}>
          <h1>Inicio</h1>
          <p>¡Bienvenido al sistema! Desde aquí puedes consultar los módulos disponibles.</p>
        </header>
      </main>
    </>
  );
}
