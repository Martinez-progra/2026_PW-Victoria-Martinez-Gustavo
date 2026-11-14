import Menu from '../components/Menu'
import '../page/style.css/styles.css';

export default function App({Component, pageProps}){
    return(
        <>
        <Menu />
        <Component {...pageProps} />
        </>

    );
}