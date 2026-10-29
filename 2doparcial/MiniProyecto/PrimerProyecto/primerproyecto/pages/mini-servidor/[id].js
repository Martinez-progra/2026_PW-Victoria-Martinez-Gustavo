import {useRouter} from 'next/router';

export default function MiniServidor() {
    const router = useRouter();
    const { id } = router.query;

    return(
        <main>
            <h1>Mini-servidor</h1>
            <p>El parámetro capturado por Next es: {id}</p>
        </main>
    );
}