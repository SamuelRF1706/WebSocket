import dotenv from 'dotenv';
dotenv.config();
import sql from 'mssql';

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    trustedConnection: true,
    driver: 'msnodesqlv8'
  }
};

export async function getConect() {
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

