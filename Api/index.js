const express = require('express');
const app = express();
const PORT = 5000;

const { getConect } = require('../Api/src/commons/dbConnection');
 // Ajusta la ruta a tu archivo donde tienes getConect

 async function testDBConnection() {
  try {
    const pool = await getConect();

    if (pool) {
      const result = await pool.request().query('SELECT 1 AS testConnection');
      console.log("✅ Consulta de prueba exitosa:", result.recordset);
    } else {
      console.error("🚫 No se pudo establecer la conexión con la base de datos.");
    }
  } catch (err) {
    console.error("❌ Error al probar la conexión:", err); // aquí era `err`, no `error`
  }
}

testDBConnection();


app.use(express.json()); // Permite leer JSON en los requests

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
