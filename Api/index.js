const express = require('express');
const app = express();
const PORT = 5000;

const { getConect } = require('../Api/src/commons/dbConnection'); // Verifica que esta ruta sea correcta

async function testDBConnection() {
  try {
    const pool = await getConect(); // Asegúrate de que la función se llame getConnect o el nombre correcto

    if (pool) {
      const result = await pool.request().query('SELECT * FROM EMPLEADO;'); //SELECT 1 AS testConnection
      console.log("✅ Consulta de prueba exitosa:", result.recordset);
    } else {
      console.error("🚫 No se pudo establecer la conexión con la base de datos.");
    }
  } catch (err) {
    console.error("❌ Error al probar la conexión:", err); // Corregido: "err" es el nombre del parámetro
  }
}
testDBConnection();

// Permite leer JSON en los requests
app.use(express.json());

// Rutas simples de ejemplo
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hola desde la API!' });
});

app.post('/api/saludo', (req, res) => {
  const nombre = req.body.nombre;
  res.json({ saludo: `Hola, ${nombre}!` });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor API escuchando en http://localhost:${PORT}`);
});
