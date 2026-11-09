const express = require('express');
const pool = require('./db');

const router = express.Router();
const categorias = ['Hardware', 'Software', 'Red', 'Accesos', 'Otro'];
const prioridades = ['Baja', 'Media', 'Alta', 'Urgente'];

function crearFolio() {
  const fecha = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const sufijo = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ST-${fecha}-${sufijo}`;
}

router.post('/', async (req, res, next) => {
  const { nombre, correo, categoria, prioridad, descripcion } = req.body ?? {};

  if (![nombre, correo, categoria, prioridad, descripcion].every((v) => typeof v === 'string' && v.trim())) {
    return res.status(400).json({ error: 'Completa nombre, correo, categoría, prioridad y descripción.' });
  }
  if (!/^\S+@\S+\.\S+$/.test(correo.trim())) {
    return res.status(400).json({ error: 'El correo no tiene un formato válido.' });
  }
  if (!categorias.includes(categoria)) {
    return res.status(400).json({ error: `Categoría inválida. Usa: ${categorias.join(', ')}.` });
  }
  if (!prioridades.includes(prioridad)) {
    return res.status(400).json({ error: `Prioridad inválida. Usa: ${prioridades.join(', ')}.` });
  }

  try {
    const folio = crearFolio();
    const { rows } = await pool.query(
      `INSERT INTO solicitudes (folio, nombre, correo, categoria, prioridad, descripcion)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, folio, nombre, correo, categoria, prioridad, descripcion, estado, creado_en`,
      [folio, nombre.trim(), correo.trim().toLowerCase(), categoria, prioridad, descripcion.trim()],
    );
    return res.status(201).json({ mensaje: 'Solicitud registrada.', solicitud: rows[0] });
  } catch (error) {
    return next(error);
  }
});

router.get('/', async (req, res, next) => {
  const { categoria, prioridad, estado } = req.query;
  const condiciones = [];
  const valores = [];
  for (const [columna, valor] of [['categoria', categoria], ['prioridad', prioridad], ['estado', estado]]) {
    if (valor) {
      valores.push(String(valor));
      condiciones.push(`${columna} = $${valores.length}`);
    }
  }

  try {
    const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
    const { rows } = await pool.query(
      `SELECT id, folio, nombre, correo, categoria, prioridad, descripcion, estado, creado_en
       FROM solicitudes ${where} ORDER BY creado_en DESC LIMIT 200`,
      valores,
    );
    return res.json({ total: rows.length, solicitudes: rows });
  } catch (error) {
    return next(error);
  }
});

router.get('/:folio', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, folio, nombre, correo, categoria, prioridad, descripcion, estado, creado_en
       FROM solicitudes WHERE folio = $1`,
      [req.params.folio],
    );
    if (!rows.length) return res.status(404).json({ error: 'No se encontró una solicitud con ese folio.' });
    return res.json({ solicitud: rows[0] });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
