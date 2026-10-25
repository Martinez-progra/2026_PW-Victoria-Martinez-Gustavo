import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { pedirJSON } from '../../lib/api';
import { formatearFecha, ocultarBoleta } from '../../lib/formato';
import { validarBoleta } from '../../lib/validaciones';
import estilos from '../../styles/Talleres.module.css';

export default function DetalleTallerPage() {
  const router = useRouter();
  const { id: routeId } = router.query;
  const [primerTallerId, setPrimerTallerId] = useState(null);
  const id = routeId || primerTallerId;

  const [taller, setTaller] = useState(null);
  const [asistencias, setAsistencias] = useState([]);
  const [errorCarga, setErrorCarga] = useState('');

  const [nombre, setNombre] = useState('');
  const [boleta, setBoleta] = useState('');
  const [errorForm, setErrorForm] = useState('');
  const [exito, setExito] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    if (!routeId) {
      pedirJSON('/talleres')
        .then((res) => {
          const talleres = Array.isArray(res) ? res : res.data;
          if (!talleres?.length) {
            setErrorCarga('No hay talleres disponibles.');
            return;
          }
          setPrimerTallerId(String(talleres[0].id));
        })
        .catch((err) => setErrorCarga(err.message || 'No se pudieron cargar los talleres.'));
      return;
    }

    setPrimerTallerId(null);
  }, [router.isReady, routeId]);

  useEffect(() => {
    if (!router.isReady || !id) return;

    if (router.query.boleta) setBoleta(String(router.query.boleta));
    if (router.query.nombre) setNombre(String(router.query.nombre));

    cargar();
  }, [router.isReady, id]);

 async function cargar() {
    if (!id) return;
    try {
      
      const resTaller = await pedirJSON(`/talleres/${id}`);
      setTaller(resTaller.data || resTaller);

     
      try {
        const resAsistencias = await pedirJSON(`/talleres/${id}/asistencias`);
        setAsistencias(Array.isArray(resAsistencias) ? resAsistencias : (resAsistencias.data || []));
      } catch (errAsistencias) {
        console.warn("No se pudieron cargar las asistencias o la ruta no está disponible:", errAsistencias.message);
        setAsistencias([]); 
      }

      setErrorCarga('');
    } catch (err) {
      setErrorCarga(err.message || "El taller no está disponible.");
    }
  }

  const ocupados = asistencias.length;
  const libres = taller ? Math.max(0, taller.cupo - ocupados) : 0;
  const lleno = taller !== null && libres === 0;

  async function inscribir(e) {
    e.preventDefault();
    setErrorForm('');
    setExito('');

    const nombreLimpio = nombre.trim();
    const boletaLimpia = boleta.trim();

    if (!nombreLimpio) return setErrorForm('Escribe tu nombre.');

    
    const errorBoleta = validarBoleta(boletaLimpia);
    if (errorBoleta) return setErrorForm(errorBoleta);

    // Validación boleta repetida en este taller
    if (asistencias.some((a) => a.boleta === boletaLimpia)) {
      return setErrorForm('Esa boleta ya está inscrita en este taller.');
    }

    if (lleno) return setErrorForm('El taller ya no tiene lugares.');

    setEnviando(true);
    try {
      await pedirJSON('/asistencias', {
        method: 'POST',
        body: JSON.stringify({ taller_id: id, nombre_alumno: nombreLimpio, boleta: boletaLimpia }),
      });
      setExito(`¡Listo! ${nombreLimpio} quedó inscrito(a) en el taller.`);
      setNombre('');
      setBoleta('');
      await cargar();
    } catch (err) {
      setErrorForm(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (errorCarga) {
    return (
      <main>
        <p className="error">{errorCarga}</p>
        <Link className={estilos.volver} href="/talleres">← Volver a talleres</Link>
      </main>
    );
  }

  if (!taller) return <main><p>Cargando taller…</p></main>;

  const porcentaje = Math.min(100, (ocupados / taller.cupo) * 100);

  return (
    <main>
      <Link className={estilos.volver} href="/talleres">← Volver a talleres</Link>
      <h1>{taller.nombre}</h1>

      <section className={estilos.panel}>
        <p><strong>Instructor:</strong> {taller.instructor || 'Por confirmar'}</p>
        <p><strong>Fecha:</strong> {formatearFecha(taller.fecha)}</p>
        <div className={estilos.barra}>
          <div className={estilos.relleno} style={{ width: `${porcentaje}%` }} />
        </div>
        <p>
          {ocupados} de {taller.cupo} lugares ocupados ·{' '}
          {lleno ? (
            <span className={estilos.lleno}>Taller lleno</span>
          ) : (
            `${libres} ${libres === 1 ? 'lugar libre' : 'lugares libres'}`
          )}
        </p>
      </section>

      <section className={estilos.panel}>
        <h2>Inscribirme</h2>
        <form onSubmit={inscribir} className="formulario">
          <input
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            placeholder="Boleta (10 dígitos)"
            value={boleta}
            onChange={(e) => setBoleta(e.target.value)}
          />
          <button type="submit" disabled={lleno || enviando}>
            {lleno ? 'Sin lugares' : enviando ? 'Inscribiendo…' : 'Inscribirme'}
          </button>
        </form>
        {errorForm && <p className="error">{errorForm}</p>}
        {exito && <p className={estilos.exito}>{exito}</p>}
      </section>

      <h2>Inscritos ({ocupados})</h2>
      {ocupados === 0 ? (
        <p>Todavía no hay inscritos. ¡Sé el primero!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Boleta</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((a, i) => (
              <tr key={a.id || i}>
                <td>{i + 1}</td>
                <td>{a.nombre_alumno}</td>
                <td>{ocultarBoleta(a.boleta)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}