const express = require('express');
const app = express();
const PORT = 5000;

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
