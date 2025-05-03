const sql = require('mssql');

require('dotenv').config();

console.log("🌱 Variables de entorno:");
console.log("DB_SERVER:", process.env.DB_SERVER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);

let pool = null;

async function getConect() {
    try {
        if (!pool) {
            pool = await sql.connect({
                server: process.env.DB_SERVER, // Usar la variable de entorno
                database: process.env.DB_NAME, // Usar la variable de entorno
                port: parseInt(process.env.DB_PORT), // Usar la variable de entorno
                options: {
                    encrypt: false, // o true, dependiendo de tu configuración
                    trustServerCertificate: true,
                    trustedConnection: true // Utiliza la autenticación de Windows
                },
                authentication: {
                    type: 'ntlm',
                    options: {
                        domain: 'FINAKTIVA',
                        userName: 'ana.chica',
                        password: '' // No se necesita contraseña para autenticación de Windows
                    }
                }
            });
            console.log("✅ CONEXIÓN EXITOSA A SQL SERVER");
        }
        return pool;
    } catch (error) {
        console.log("❌ Error al conectar con SQL Server:");
        console.error(error);
        return null;
    }
}

module.exports = { getConect };

