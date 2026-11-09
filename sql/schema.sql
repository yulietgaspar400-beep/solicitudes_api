CREATE TABLE IF NOT EXISTS solicitudes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  folio VARCHAR(32) NOT NULL UNIQUE,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(254) NOT NULL,
  categoria VARCHAR(30) NOT NULL CHECK (categoria IN ('Hardware', 'Software', 'Red', 'Accesos', 'Otro')),
  prioridad VARCHAR(20) NOT NULL CHECK (prioridad IN ('Baja', 'Media', 'Alta', 'Urgente')),
  descripcion TEXT NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'Abierta' CHECK (estado IN ('Abierta', 'En proceso', 'Resuelta')),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS solicitudes_creado_en_idx ON solicitudes (creado_en DESC);
CREATE INDEX IF NOT EXISTS solicitudes_categoria_idx ON solicitudes (categoria);
CREATE INDEX IF NOT EXISTS solicitudes_prioridad_idx ON solicitudes (prioridad);
