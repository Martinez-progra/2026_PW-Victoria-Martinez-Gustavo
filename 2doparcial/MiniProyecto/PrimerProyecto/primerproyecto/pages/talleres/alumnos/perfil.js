import { useState } from 'react';
import Link from 'next/link';
import { pedirJSON } from '../../../lib/api';
import { formatearFecha } from '../../../lib/formato';
import { validarBoleta } from '../../../lib/validaciones';
import estilos from '../../../styles/Talleres.module.css';

function obtenerLista(respuesta) {
  return Array.isArray(respuesta) ? respuesta : respuesta?.data;
}

export default function PerfilAlumno() {
  const [boleta, setBoleta] = useState('');
  const [boletaBuscada, setBoletaBuscada] = useState('');
  const [alumno, setAlumno] = useState(null);
  const [misTalleres, setMisTalleres] = useState([]);
  const [disponibles, setDisponibles] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function buscarPerfil(e) {
    e.preventDefault();
    setError('');

    const boletaLimpia = boleta.trim();
    const errorBoleta = validarBoleta(boletaLimpia);
    if (errorBoleta) {
      setError(errorBoleta);
      setBoletaBuscada('');
      return;
    }

    setCargando(true);
    try {
      const [respuestaUsuarios, respuestaTalleres] = await Promise.all([
        pedirJSON('/usuarios'),
        pedirJSON('/talleres')
      ]);
      const usuarios = obtenerLista(respuestaUsuarios);
      const talleres = obtenerLista(respuestaTalleres);

      if (!Array.isArray(usuarios) || !Array.isArray(talleres)) {
        throw new Error('El servidor devolvió datos de perfil con un formato inesperado.');
      }

      const talleresConAsistencias = await Promise.all(
        talleres.map(async (taller) => {
          const respuesta = await pedirJSON(`/talleres/${taller.id}/asistencias`);
          const asistencias = obtenerLista(respuesta);
          if (!Array.isArray(asistencias)) {
            throw new Error(`No se pudieron cargar las inscripciones de ${taller.nombre}.`);
          }
          return { ...taller, asistencias };
        })
      );

      const inscritos = talleresConAsistencias
        .filter((taller) => taller.asistencias.some((asistencia) => asistencia.boleta === boletaLimpia))
        .map((taller) => ({
          ...taller,
          inscripcion: taller.asistencias.find((asistencia) => asistencia.boleta === boletaLimpia)
        }));
      const usuario = usuarios.find((item) => String(item.boleta) === boletaLimpia);
      const inscripcion = inscritos[0]?.inscripcion;
      const perfil = usuario || (inscripcion ? {
        nombre: inscripcion.nombre_alumno,
        boleta: boletaLimpia,
        rol: 'Estudiante'
      } : null);

      setAlumno(perfil);
      setMisTalleres(inscritos);
      setDisponibles(
        talleresConAsistencias.filter(
          (taller) => !inscritos.some((inscrito) => inscrito.id === taller.id) &&
            taller.asistencias.length < Number(taller.cupo)
        )
      );
      setBoletaBuscada(boletaLimpia);
    } catch (err) {
      setError(err.message || 'No se pudo cargar el perfil.');
      setBoletaBuscada('');
      setAlumno(null);
      setMisTalleres([]);
      setDisponibles([]);
    } finally {
      setCargando(false);
    }
  }

  const nombreAlumno = alumno?.nombre || '';

  return (
    <>
      <nav>
        <Link href="/">Inicio</Link>
        <Link href="/mini-servidor/1">Mini-servidor /1</Link>
        <Link href="/talleres">Talleres</Link>
        <Link href="/talleres/alumnos/perfil">Mi perfil</Link>
      </nav>
      <main style={{ maxWidth: '765px' }}>
        <h1>Mi perfil</h1>

        <form onSubmit={buscarPerfil} className={`formulario ${estilos.formularioPerfil}`}>
          <input
            placeholder="Tu boleta (10 dígitos)"
            value={boleta}
            maxLength={10}
            onChange={(e) => setBoleta(e.target.value)}
          />
          <button type="submit" disabled={cargando}>
            {cargando ? 'Buscando…' : 'Ver mi perfil'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {boletaBuscada && (
          <>
            <section className={estilos.panel}>
              {alumno ? (
                <>
                  <h2>{alumno.nombre}</h2>
                  {alumno.email && <p><strong>Correo:</strong> {alumno.email}</p>}
                  <p><strong>Boleta:</strong> {boletaBuscada}</p>
                  <p><strong>Rol:</strong> {alumno.rol || 'Estudiante'}</p>
                </>
              ) : (
                <p>
                  No hay una cuenta registrada para la boleta {boletaBuscada}. Si ya estás inscrito
                  en un taller, usa la misma boleta para consultar tu inscripción.
                </p>
              )}
            </section>

            <h2>Mis talleres ({misTalleres.length})</h2>
            {misTalleres.length === 0 ? (
              <p>Todavía no estás inscrito en ningún taller.</p>
            ) : (
              <ul className={estilos.lista}>
                {misTalleres.map((taller) => (
                  <li key={taller.id}>
                    <Link href={`/talleres/${taller.id}`}>{taller.nombre}</Link>
                    {' — '}{formatearFecha(taller.fecha)}
                  </li>
                ))}
              </ul>
            )}

            <h2>Talleres con lugar disponible</h2>
            {disponibles.length === 0 ? (
              <p>No hay más talleres con lugar.</p>
            ) : (
              <ul className={estilos.lista}>
                {disponibles.map((taller) => {
                  const lugaresLibres = Number(taller.cupo) - taller.asistencias.length;
                  return (
                    <li key={taller.id}>
                      {taller.nombre} — {lugaresLibres} {lugaresLibres === 1 ? 'lugar' : 'lugares'} ·{' '}
                      <Link
                        href={`/talleres/${taller.id}?boleta=${encodeURIComponent(boletaBuscada)}&nombre=${encodeURIComponent(nombreAlumno)}`}
                      >
                        Inscribirme
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </main>
    </>
  );
}
