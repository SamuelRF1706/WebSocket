const sql = require('mssql/msnodesqlv8'); // este es importante 

const config = {
    connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_DATABASE};Trusted_Connection=yes; Connection Timeout=60`
};

async function getConect() {
    try {
        const pool = await sql.connect(config);
        console.log("✅ CONEXIÓN EXITOSA A SQL SERVER");
        return pool;
    } catch (error) {
        console.log("❌ Error al conectar con SQL Server:");
        console.error(error);
        return null;
    }
}

module.exports = { getConect };

