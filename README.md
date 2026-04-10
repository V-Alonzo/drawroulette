# Actividad sobre Selección y Registro de Boletos de Sorteo

## Descripción del proyecto
Este proyecto implementa una actividad completa de sorteo de boletos usando una ruleta interactiva. El flujo principal permite:

- Mostrar los números de boletos disponibles.
- Seleccionar un número al azar desde la ruleta.
- Registrar manualmente los datos del participante para un boleto específico.
- Consultar y actualizar los boletos ya registrados.

La aplicación está separada en dos partes:

- `frontend`: interfaz web en Next.js (React) con formulario de registro, ruleta y tabla de boletos.
- `backend`: API en Express conectada a Firebase Realtime Database para persistir y sincronizar los registros.

---

## Objetivo de la actividad
### Objetivo general
Desarrollar una solución web full stack para gestionar un sorteo de boletos, asegurando que cada número se registre una sola vez y que la información se mantenga sincronizada en tiempo real.

### Funcionalidades principales
- Obtención de números disponibles para la ruleta.
- Asignación aleatoria de boletos no registrados.
- Registro de boleto con validaciones básicas (`name`, `email`, `phone`, `ticketNumber`).
- Consulta de boletos registrados.
- Sincronización con Firebase para mantener los datos persistentes.

### Despliegue
El proyecto puede desplegarse de forma separada:

- Frontend (Next.js): Vercel, Netlify u otro hosting Node-compatible.
- Backend (Express): Render, Railway, Fly.io o servidor Node propio.
- Base de datos: Firebase Realtime Database.

En producción, el frontend debe apuntar al backend publicado mediante la variable `NEXT_PUBLIC_API_URL`.

---

## Requisitos técnicos
### Entorno
- Node.js 18+
- npm 9+
- Cuenta y proyecto de Firebase con Realtime Database habilitado

### Dependencias clave
#### Frontend
- Next.js 16
- React 19
- TypeScript
- ESLint

#### Backend
- Express 5
- Firebase SDK
- CORS
- dotenv

### Variables de entorno requeridas
#### Backend (`backend/.env`)
```env
PORT=5001
FRONTEND_URL=http://localhost:3000

MINIMUM_NUMBER_TICKETS=1
MAXIMUM_NUMBER_TICKETS=100

FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_DATABASE_URL=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
FIREBASE_MEASUREMENT_ID=...
```

#### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

---

## Estructura relevante del proyecto
```text
boletos-ruleta-disney/
├─ backend/
│  ├─ index.js                 # API Express + integración con Firebase
│  └─ package.json
├─ frontend/
│  ├─ app/
│  │  ├─ page.tsx              # Vista principal de la actividad
│  │  └─ components/
│  │     ├─ Roulette.tsx       # Lógica y visualización de ruleta
│  │     ├─ RegistryForm.tsx   # Formulario de registro de boleto
│  │     ├─ Modal.tsx          # Modal de registro
│  │     └─ TicketsTable.tsx   # Tabla de boletos registrados
│  ├─ package.json
│  └─ README.md                # README base de Next.js
└─ README.md                   # Este documento
```

---

## Uso y personalización
### 1) Instalación
En dos terminales distintas:

```bash
# Backend
cd backend
npm install
npm run dev
```

```bash
# Frontend
cd frontend
npm install
npm run dev
```

Con eso, la app quedará disponible en:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5001`

### 2) Endpoints principales del backend
- `GET /api/getFreeNumbers`: devuelve números disponibles.
- `GET /api/getNumber`: devuelve un número aleatorio disponible.
- `GET /api/getRegisteredTickets`: devuelve los boletos registrados.
- `POST /api/registerTicket`: registra un boleto.

### 3) Personalización rápida
- Rango de boletos: cambia `MINIMUM_NUMBER_TICKETS` y `MAXIMUM_NUMBER_TICKETS`.
- URL del backend en frontend: cambia `NEXT_PUBLIC_API_URL`.
- Estilo/UX de ruleta: edita `frontend/app/components/Roulette.tsx`.
- Campos o validaciones del formulario: edita `frontend/app/components/RegistryForm.tsx`.

### 4) Recomendaciones para producción
- Restringir CORS al dominio real del frontend.
- Agregar validaciones más robustas en backend (formato de email/teléfono y sanitización).
- Implementar autenticación si se requiere control de acceso administrativo.
- Configurar logs y monitoreo de errores.
