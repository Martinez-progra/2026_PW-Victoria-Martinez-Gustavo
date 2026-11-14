import Link from 'next/link';
export default function Home(){
    return(
        <main>
            <h1>Esto es un ejemplo de Pagina Principal con Next</h1>
            <p>
                <Link href="./practica/">Ir a Paractica 1</Link>
            </p>
        </main>
    )
}