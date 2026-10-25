import { useState, useEffect } from 'react';
import Link from 'next/link';
import { pedirJSON } from '../../lib/api';

import estilos from '../../styles/Talleres.module.css';

export default function TalleresPage() {
    const [talleres, setTalleres] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        async function cargarTalleres() {
            try {
                const res = await pedirJSON('/talleres');
                setTalleres(res.data || res);
            } catch (err) {
                setError(err.message || "Error al cargar los talleres");
            }
        }
        cargarTalleres();
    }, []);

    const talleresFiltrados = talleres.filter((taller) => {
        const termino = busqueda.trim().toLocaleLowerCase();
        return (
            taller.nombre?.toLocaleLowerCase().includes(termino) ||
            taller.instructor?.toLocaleLowerCase().includes(termino)
        );
    });

    return (
        <main style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <Link href="/" className={estilos.volver}>← Volver al inicio</Link>
            <h1 style={{ marginTop: '16px', marginBottom: '24px' }}>Lista de Talleres Disponibles</h1>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <input
                className={estilos.buscador}
                type="search"
                placeholder="Buscar por nombre o instructor"
                aria-label="Buscar talleres por nombre o instructor"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />

            <div className={estilos.rejilla}>
                {talleres.length === 0 && !error ? (
                    <p>Cargando talleres...</p>
                ) : talleresFiltrados.length === 0 ? (
                    <p>No se encontraron talleres con ese nombre o instructor.</p>
                ) : (
                    talleresFiltrados.map((taller) => (
                        <div key={taller.id} className={estilos.panel}>
                            <h3 style={{ marginTop: 0 }}>{taller.nombre}</h3>
                            <p>{taller.descripcion || 'Sin descripción'}</p>
                            <p><strong>Cupo:</strong> {taller.cupo} lugares</p>
                            <Link href={`/talleres/${taller.id}`} className={estilos.volver}>
                                Ver detalles e inscribirme →
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}