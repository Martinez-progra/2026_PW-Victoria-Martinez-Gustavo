import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PerfilAlumno() {
  const router = useRouter();
  const { boleta: boletaQuery } = router.query;
  
  const [boleta, setBoleta] = useState(boletaQuery || '');
  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function buscarPerfil(e) {
    if (e) e.preventDefault();
    const boletaLimpia = boleta.trim();
    
    if (!boletaLimpia || boletaLimpia.length !== 10) {
      setError('Por favor, ingresa una boleta válida de 10 dígitos.');
      return;
    }

    setCargando(true);
    setError('');
    
    try {
      const res = await fetch(`/api/talleres/alumno?boleta=${encodeURIComponent(boletaLimpia)}`);
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
      buscarPerfil();
    }
  }, [boletaQuery]);

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Perfil de Alumno</h1>
      <p>Consulta los talleres en los que estás inscrito ingresando tu número de boleta.</p>

      <form onSubmit={buscarPerfil} style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <input
          type="text"
          value={boleta}
          onChange={(e) => setBoleta(e.target.value)}
          placeholder="Número de boleta (10 dígitos)"
          maxLength={10}
          style={{ padding: '10px', fontSize: '16px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" disabled={cargando} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
          {cargando ? 'Buscando...' : 'Consultar'}
        </button>
      </form>

      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #e1e1e1', marginTop: '20px' }}>
        <h2>Mis Talleres Inscritos</h2>
        {inscripciones.length === 0 ? (
          <p style={{ color: '#666' }}>No hay talleres registrados para esta boleta.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Taller</th>
                <th style={{ padding: '10px' }}>Instructor</th>
                <th style={{ padding: '10px' }}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {inscripciones.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{item.nombre_taller || item.titulo}</td>
                  <td style={{ padding: '10px' }}>{item.instructor || 'Por confirmar'}</td>
                  <td style={{ padding: '10px' }}>{item.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}