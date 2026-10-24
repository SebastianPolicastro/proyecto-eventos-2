# Plataforma de Eventos e Inscripciones

API REST para gestionar eventos e inscripciones. Este proyecto corresponde a Backend II: la base arquitectónica (Pre-entrega 1) y el registro seguro de usuarios (Pre-entrega 2), organizado por capas y listo para escalar.

**Temática elegida:** plataforma de eventos e inscripciones (con control de cupos, roles y notificaciones en próximas entregas).

## Tecnologías

- Node.js (módulos ESM)
- Express
- MongoDB con Mongoose
- bcrypt (hash de contraseñas)
- dotenv

## Instalación

```bash
git clone https://github.com/SebastianPolicastro/proyecto-eventos-2.git
cd proyecto-eventos-2
npm install
```

## Configuración de variables de entorno

Copiá el archivo de ejemplo y completá los valores:

```bash
cp .env.example .env
```

En Windows: `copy .env.example .env`.

| Variable     | Descripción                                        |
|--------------|----------------------------------------------------|
| `PORT`       | Puerto donde corre el servidor (default 8080)      |
| `NODE_ENV`   | Entorno de ejecución (`development`, `production`) |
| `MONGO_URL`  | URL de conexión a MongoDB (local o Atlas)          |
| `JWT_SECRET` | Secreto para firmar los JWT (próximas entregas)    |

El archivo `.env` no se sube al repositorio.

## Cómo ejecutar

Hace falta tener MongoDB disponible (local o MongoDB Atlas) y `MONGO_URL` configurada en el `.env`.

```bash
npm start      # producción
npm run dev    # desarrollo, con recarga automática
```

## Estructura de carpetas

```
proyecto-eventos/
├── src/
│   ├── app.js                       # configura Express (no levanta el server)
│   ├── server.js                    # conecta a MongoDB y levanta el servidor
│   ├── config/
│   │   ├── env.js                   # variables de entorno
│   │   └── db.js                    # conexión a MongoDB
│   ├── routes/
│   │   ├── health.router.js
│   │   ├── events.router.js
│   │   └── sessions.router.js
│   ├── controllers/
│   │   ├── health.controller.js
│   │   ├── events.controller.js
│   │   └── sessions.controller.js
│   ├── services/
│   │   ├── events.service.js
│   │   └── sessions.service.js      # validaciones y lógica del registro
│   ├── repositories/
│   │   ├── events.repository.js
│   │   └── users.repository.js
│   ├── dao/
│   │   ├── events.dao.js
│   │   └── users.dao.js             # acceso a la colección de usuarios
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
│   ├── middlewares/                 # vacía por ahora
│   └── utils/
│       ├── hash.js                  # helper de bcrypt reutilizable
│       └── AppError.js              # error con código HTTP
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

Flujo de una request: `routes → controllers → services → repositories → dao → models`.

## Rutas disponibles

| Método | Ruta                     | Descripción                                     | Respuesta |
|--------|--------------------------|-------------------------------------------------|-----------|
| GET    | `/api/health`            | Verifica que el servidor esté activo            | `200` `{ "status": "ok", "message": "Servidor activo" }` |
| GET    | `/api/events`            | Lista de eventos (vacía por ahora)              | `200` `{ "status": "success", "payload": [] }` |
| POST   | `/api/sessions/register` | Registro de usuarios                            | `201`, `400` o `409` (ver abajo) |
| POST   | `/api/sessions/login`    | Login (estructura inicial, sin lógica)          | `501` |
| GET    | `/api/sessions/current`  | Usuario actual (estructura inicial, sin lógica) | `501` |

## Registro de usuarios

`POST /api/sessions/register`

### Campos que espera el body (JSON)

| Campo        | Obligatorio | Detalle |
|--------------|-------------|---------|
| `first_name` | Sí          | Texto no vacío |
| `last_name`  | Sí          | Texto no vacío |
| `email`      | Sí          | Formato válido. Se normaliza (sin espacios y en minúsculas) antes de guardar |
| `password`   | Sí          | Mínimo 8 caracteres. Se guarda hasheada con bcrypt |

El rol no se puede enviar desde el body: todos los usuarios registrados quedan con rol `user`. Los valores posibles del modelo son `user`, `organizer` y `admin`.

### Ejemplo de request

```json
{ "first_name": "Ana", "last_name": "Pérez", "email": "Ana@Mail.com ", "password": "Secreta123" }
```

### Respuestas

`201` usuario creado (sin contraseña, ni en texto plano ni hasheada):

```json
{
  "status": "success",
  "payload": {
    "id": "665f2a...",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

`400` campos faltantes, email inválido o contraseña corta:

```json
{ "status": "error", "message": "Faltan campos obligatorios" }
```

`409` email ya registrado:

```json
{ "status": "error", "message": "El email ya está registrado" }
```

### Cómo probarlo

1. Tener MongoDB disponible y `MONGO_URL` configurada en el `.env`.
2. Levantar el servidor con `npm start` (debe mostrar `Conectado a MongoDB`).
3. Enviar un `POST` a `http://localhost:8080/api/sessions/register` con Postman o Thunder Client, con el body de ejemplo.
4. Casos a verificar: registro exitoso, campos faltantes, email con formato inválido, email ya registrado, y que en la base la contraseña aparezca hasheada (`$2b$10$...`) y que la respuesta no la incluya.