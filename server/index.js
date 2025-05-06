import express from 'express';
import { getConect } from './commons/dbConnection.js'; // Asegúrate de poner la extensión .js

const app = express();
const PORT = 5000;

async function testDBConnection() {
  try {
    const pool = await getConect();

    if (pool) {
      const result = await pool.request().query('SELECT * FROM EMPLEADO;');
      console.log("✅ Consulta de prueba exitosa:", result.recordset);
    } else {
      console.error("🚫 No se pudo establecer la conexión con la base de datos.");
    }
  } catch (err) {
    console.error("❌ Error al probar la conexión:", err);
  }
}

testDBConnection();

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
