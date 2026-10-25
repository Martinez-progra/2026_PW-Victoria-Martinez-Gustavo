import Link from 'next/link';
import estilos from '../styles/TarjetaTaller.module.css';

export default function TarjetaTaller({ taller }) {
  
  const hoy = new Date().toISOString().split('T')[0];
  const pasado = taller.fecha && taller.fecha < hoy;

  return (
    <div className={estilos.tarjeta}>
      {pasado ? (
        <span className={`${estilos.etiqueta} ${estilos.finalizado}`}>Finalizado</span>
      ) : (
        <span className={`${estilos.etiqueta} ${estilos.proximo}`}>Próximo</span>
      )}
      <h3>{taller.nombre}</h3>
      <p><strong>Instructor:</strong> {taller.instructor || 'Por confirmar'}</p>
      <p><strong>Fecha:</strong> {taller.fecha}</p>
      <p><strong>Cupo:</strong> {taller.cupo} lugares</p>
      <Link href={`/talleres/${taller.id}`}>
        Ver detalle e inscribirme →
      </Link>
    </div>
  );
}