# Room booking

Web app for managing meeting rooms, user accounts, and bookings. The backend is a REST API (Express + Sequelize + PostgreSQL); the frontend is a React (Vite) SPA with Redux for auth state.

---

## Features

- **Authentication**: Register, login, logout, refresh tokens. JWTs are issued on register/login and can be stored in HTTP-only cookies (see `User` controller).
- **Meeting rooms**: CRUD for rooms.
- **Room membership**: Assign users to rooms and roles (`/rooms/users/...`).
- **Bookings**: Create, list, update, delete bookings; optional participants (`/booking-participants/...`).
- **Mock payment (testing only)**: `POST /payments/test-charge` simulates charging for a room booking (no real payment provider). The booking UI can require this step before creating a booking.

---

## Tech stack

| Layer    | Stack |
|----------|--------|
| Backend  | Node.js, Express 5, TypeScript, Sequelize, PostgreSQL, bcrypt, JWT |
| Frontend | React 19, Vite, TypeScript, Redux Toolkit, Axios, Tailwind CSS, react-toastify |

---

## Repository layout

```
room_booking/
├── backend/          # Express API
│   └── src/
│       ├── app.ts
│       ├── config/   # DB (Sequelize)
│       ├── controllers/
│       ├── models/
│       └── routes/
└── frontend/         # Vite + React
    └── src/
        ├── components/
        ├── services/ # API clients (axios base URL in config)
        └── redux/
```

---

## Prerequisites

- **Node.js** (LTS recommended)
- **PostgreSQL** running locally or remotely

---

## Backend setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Environment variables

Create a `.env` file in `backend/` (values are examples only):

```env
# Database
DB_HOST=localhost
DB_NAME=room_booking
DB_USER=postgres
DB_PASS=your_password

# JWT (required for auth)
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

# Optional: server port (default 5501)
PORT=5501
```

The app loads these with `dotenv` and connects via `src/config/db.ts`.

### 3. Database

Create an empty PostgreSQL database matching `DB_NAME`. On startup, the server runs `sequelize.sync({ alter: true })`, which updates tables to match models (suitable for development; review for production).

### 4. Run the API

```bash
cd backend
npm run dev
```

Default URL: `http://localhost:5501` (unless `PORT` overrides it).

---

## Frontend setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. API base URL

The frontend calls the backend using `frontend/src/config/config.ts`:

```ts
export const backUrl = 'http://localhost:5501';
```

Change `backUrl` if the API runs on another host or port. CORS is enabled in the backend with credentials support for cookie-based auth.

### 3. Run the dev server

```bash
cd frontend
npm run dev
```

Vite’s default dev URL is `http://localhost:5173` (see terminal output if the port differs).

### 4. Production build

```bash
cd frontend
npm run build
npm run preview   # optional: serve the built app locally
```

---

## API overview

Base URL: `http://localhost:5501` (adjust as needed).

### Auth (`/auth`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register; returns user and tokens |
| POST | `/auth/login` | Login; returns user and tokens |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout |
| GET | `/auth/all` | List users |

### Meeting rooms (`/rooms`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/rooms` | Create room |
| GET | `/rooms` | List rooms |
| GET | `/rooms/:roomId` | Get room |
| PUT | `/rooms/:roomId` | Update room |
| DELETE | `/rooms/:roomId` | Delete room |

### Room users (`/rooms/users`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/rooms/users/add` | Add user to room |
| POST | `/rooms/users/remove` | Remove user from room |
| GET | `/rooms/users/:roomId/users` | List users in room |
| POST | `/rooms/users/role` | Set user role in room |

### Bookings (`/bookings`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/bookings` | Create booking (body: `roomId`, `createdBy`, `startTime`, `endTime`, optional `description`, `participantIds`) |
| GET | `/bookings` | List bookings (includes room, creator, participants where configured) |
| GET | `/bookings/:bookingId` | Get one booking |
| PUT | `/bookings/:bookingId` | Update booking |
| DELETE | `/bookings/:bookingId` | Delete booking |

### Booking participants (`/booking-participants`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/booking-participants` | Add participant |
| DELETE | `/booking-participants` | Remove participant |
| GET | `/booking-participants/:bookingId/participants` | List participants |

### Mock payment (`/payments`) — testing only

| Method | Path | Description |
|--------|------|-------------|
| POST | `/payments/test-charge` | Simulates payment for a room/time range |

**Request body (JSON):**

- `roomId` (number, required)
- `userId` (number, required)
- `startTime`, `endTime` (ISO strings or dates, required)
- `forceStatus` (optional): `"success"` or `"failed"` to make the mock deterministic

**Behavior:**

- Validates that the room and user exist and that `endTime` is after `startTime`.
- Computes a test amount from duration (implementation uses a fixed hourly rate in `Payment` controller).
- If `forceStatus` is omitted, the outcome is randomized (mostly success) to mimic flaky test payments.
- On simulated failure, responds with **402** and a JSON body including `status`, `transactionId`, `amount`, `currency`.
- On success, responds with **200** and the same fields.

This is **not** a real PSP integration; use it only to exercise flows in development or demos.

---

## Frontend usage notes

- After login/register, the app stores user info client-side (see `config.ts` helpers) and uses Axios with `withCredentials: true` so cookies can be sent when the API expects them.
- Booking form: optional **“Test payment for room booking”** runs the mock charge before `POST /bookings` when enabled; if the mock fails, the booking is not created.

---

## Scripts summary

| Location | Command | Purpose |
|----------|---------|---------|
| `backend` | `npm run dev` | Run API with `ts-node-dev` |
| `frontend` | `npm run dev` | Vite dev server |
| `frontend` | `npm run build` | Typecheck + production bundle |
| `frontend` | `npm run lint` | ESLint |

---

## License

See project or package metadata if a license is specified per package.
