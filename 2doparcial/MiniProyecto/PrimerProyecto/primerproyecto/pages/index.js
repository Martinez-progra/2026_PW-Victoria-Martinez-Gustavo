
import Link from 'next/link';


export default function Home() {
  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      
      <h1>Bienvenido a la Aplicación de Talleres</h1>
      <p>Selecciona una opción para continuar:</p>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
        <li style={{ marginBottom: '10px' }}>
          <Link href="/talleres" style={{ color: 'blue', textDecoration: 'underline', fontSize: '18px' }}>
            Ver Lista de Talleres →
          </Link>
        </li>
      </ul>
    </main>
  );
}