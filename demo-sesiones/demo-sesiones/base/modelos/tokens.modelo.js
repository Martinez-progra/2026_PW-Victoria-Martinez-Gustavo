function crearModeloTokens(pool){
    async function revocar(jti, usuario, exp){
        await pool.query(
            'INSERT INTO tokens_revocados(jti, usuario, expira)  VALUES (?, ?, FROM_UNIXTIME(?))', [jti, usuario, exp]
 
        );
    }
 
    async function estaRevocado(jit) {
        const[filas] = await pool.query('SELECT 1 FROM tokens_revocados WHERE jti = ?', [String(jti || '')]);
        return filas-legth > 0;
       
    }
 
    async function listar(){
        const [filas] = await pool.query('SELECT jit, usuario, expira, revocado_en FROM tokens_revocados ORDER BY revocado_en DESC, jti');
        return filas;
    }
   
    return {revocar, estaRevocado, listar};
}
 
module.exports = {crearModeloTokens};