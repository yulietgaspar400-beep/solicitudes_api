require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./db');
const solicitudesRouter = require('./solicitudes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({ mensaje: 'API de solicitudes de soporte', estado: 'activa' });
});

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ estado: 'ok', baseDeDatos: 'conectada' });
  } catch (error) {
    console.error('Health check falló:', error.message);
    res.status(503).json({ estado: 'error', baseDeDatos: 'no disponible' });
  }
});

app.use('/api/solicitudes', solicitudesRouter);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Ocurrió un error interno.' });
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`API lista en el puerto ${port}`);
});

async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
