import { useState } from 'react';
import Link from 'next/link';
import { pedirJSON } from '../lib/api';
import { formatearFecha } from '../lib/formato';
import { validarBoleta } from '../lib/validaciones';
import estilos from '../styles/Talleres.module.css';

export default function PerfilPage() {
  const [boleta, setBoleta] = useState('');
  const [buscada, setBuscada] = useState('');
  const [alumno, setAlumno] = useState(null);
  const [nombreInscrito, setNombreInscrito] = useState('');
  const [misTalleres, setMisTalleres] = useState([]);
  const [disponibles, setDisponibles] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

 
    async function buscarPerfil(e) {
    if (e) e.preventDefault();
    const boletaLimpia = boleta ? boleta.trim() : '';
    
    
    const errorBoleta = validarBoleta ? validarBoleta(boletaLimpia) : null;
    
    if (errorBoleta) {
      setError(errorBoleta);
      return;
    }

    setCargando(true);
    setError('');
    
    try {
      const res = await fetch(`/api/alumnos/${boletaLimpia}/talleres`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'No se encontró información para esta boleta.');
      
      setInscripciones(data.data || data);
    } catch (err) {
      setError(err.message);
      setInscripciones([]);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    if (boletaQuery) {
      setBoleta(boletaQuery);
     
    }
  }, [boletaQuery]);

  const nombre = alumno ? alumno.nombre : nombreInscrito;

  return (
    <main>
      <h1>Mi perfil</h1>

      <form onSubmit={buscar} className="formulario">
        <input
          placeholder="Tu boleta (10 dígitos)"
          value={boleta}
          onChange={(e) => setBoleta(e.target.value)}
        />
        <button type="submit" disabled={cargando}>
          {cargando ? 'Buscando…' : 'Ver mi perfil'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {buscada && (
        <>
          <section className={estilos.panel}>
            {alumno ? (
              <>
                <h2>{alumno.nombre}</h2>
                <p><strong>Correo:</strong> {alumno.correo}</p>
                <p><strong>Boleta:</strong> {alumno.boleta}</p>
                <p><strong>Rol:</strong> {alumno.rol}</p>
              </>
            ) : (
              <p>
                La boleta {buscada} no tiene cuenta registrada
                {nombreInscrito ? ` (inscripciones a nombre de ${nombreInscrito})` : ''}. Aun así puedes
                inscribirte en un taller.
              </p>
            )}
          </section>

          <h2>Mis talleres ({misTalleres.length})</h2>
          {misTalleres.length === 0 ? (
            <p>Todavía no estás inscrito en ningún taller.</p>
          ) : (
            <ul className={estilos.lista}>
              {misTalleres.map((t) => (
                <li key={t.id}>
                  <Link href={`/talleres/${t.id}`}>{t.nombre}</Link> — {formatearFecha(t.fecha)}
                </li>
              ))}
            </ul>
          )}

          <h2>Talleres con lugar disponible</h2>
          {disponibles.length === 0 ? (
            <p>No hay más talleres con lugar.</p>
          ) : (
            <ul className={estilos.lista}>
              {disponibles.map((t) => {
                const lugaresLibres = t.cupo - t.asistencias.length;
                return (
                  <li key={t.id}>
                    {t.nombre} — {lugaresLibres} {lugaresLibres === 1 ? 'lugar' : 'lugares'} ·{' '}
                    <Link
                      href={`/talleres/${t.id}?boleta=${buscada}&nombre=${encodeURIComponent(nombre)}`}
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
  );
}