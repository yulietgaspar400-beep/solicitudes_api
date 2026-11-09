# API de solicitudes de soporte

Base de proyecto para el segundo parcial: API REST con Node.js, Express y PostgreSQL. La API registra solicitudes, crea folios y permite consultar todas las solicitudes o una por folio.

## Requisitos

- Node.js 20 o superior
- Una base de datos PostgreSQL (por ejemplo, Neon)
- npm

## Preparar la base de datos

1. Crea un proyecto PostgreSQL en Neon.
2. En el SQL Editor de Neon, pega y ejecuta el contenido de `sql/schema.sql`.
3. Copia la cadena de conexión de Neon. Guárdala como `DATABASE_URL` en un archivo `.env` local.

## Ejecutar localmente

En una terminal, dentro de esta carpeta:

```bash
npm install
```

Copia `.env.example` a `.env`, reemplaza `DATABASE_URL` por la cadena de conexión real y ejecuta:

```bash
npm run dev
```

La API queda en `http://localhost:3000`. No compartas ni subas el archivo `.env` porque contiene la contraseña de la base de datos.

## Rutas

| Método | Ruta | Uso |
|---|---|---|
| GET | `/api/health` | Comprueba API y conexión a PostgreSQL |
| POST | `/api/solicitudes` | Registra una solicitud y devuelve su folio |
| GET | `/api/solicitudes` | Lista las últimas 200 solicitudes |
| GET | `/api/solicitudes?categoria=Hardware` | Filtra por categoría; también acepta `prioridad` y `estado` |
| GET | `/api/solicitudes/ST-AAAA-MM-DD-XXXXX` | Busca una solicitud por folio |

### Ejemplo para registrar

Envía `POST /api/solicitudes` con encabezado `Content-Type: application/json` y este cuerpo:

```json
{
  "nombre": "Ana Pérez",
  "correo": "ana@example.com",
  "categoria": "Software",
  "prioridad": "Media",
  "descripcion": "No puedo abrir el programa de inventario."
}
```

Categorías permitidas: `Hardware`, `Software`, `Red`, `Accesos`, `Otro`.

Prioridades permitidas: `Baja`, `Media`, `Alta`, `Urgente`.

## Despliegue básico en Render

1. Sube el proyecto a un repositorio Git.
2. En Render, crea un **Web Service** conectado al repositorio.
3. Usa `npm install` como comando de construcción y `npm start` como comando de inicio.
4. Configura `DATABASE_URL` en las variables de entorno del servicio con la cadena de Neon.
5. Cuando Render termine, visita `/api/health` para verificar la conexión.

La URL pública se puede configurar luego como destino del flujo n8n. Para uso real conviene añadir autenticación y limitar CORS; esta base está pensada para el proyecto escolar.
