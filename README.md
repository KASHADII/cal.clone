# Cal.clone

A minimal, production-ready scheduling and booking application heavily inspired by [Cal.com](https://cal.com) and Calendly. Built seamlessly from scratch to provide a frictionless scheduling experience without heavy ORMs or third-party bloated libraries.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2-61DAFB.svg?logo=react)
![Nodejs](https://img.shields.io/badge/Node.js-Express-339933.svg?logo=nodedotjs)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css)
![Postgres](https://img.shields.io/badge/PostgreSQL-Supabase-336791.svg?logo=postgresql)

---

## ✨ Features

### 📅 Public Booking Experience
- **Interactive Calendar Grid:** A fully custom, highly responsive `<Calendar />` parsing exact days and disabling past dates interactively using `date-fns`.
- **Dynamic Slot Engine:** Time slots aren't hardcoded. They are meticulously calculated on the fly using your `duration` + `availability` settings—while actively scanning the database to hide **double-bookings**.
- **Timezone Awareness:** Automatically displays the public user's detected local timezone (e.g. `America/New_York`) to avoid scheduling miscommunications.
- **Dark Mode Support:** Integrated context-based theme system utilizing `localStorage` and system defaults.

### ⚙️ Private Dashboard
- **Event Management:** Create, duplicate, edit, and delete event types through beautiful Radix UI-powered Dialog modals.
- **Availability Matrix:** Explicitly toggle which days of the week you take meetings, setting start and end boundaries (e.g., Mon-Fri 09:00 to 17:00).
- **Bookings Ledger:** Your upcoming and past bookings are segregated automatically based on live system bounds, with optimistic UI cancellation support.

---

## 🏗️ Architecture

- **Frontend:** React + Vite, styled utilizing [Tailwind CSS v3](https://tailwindcss.com/) and primitive un-styled components mimicking **[shadcn/ui](https://ui.shadcn.com/)** and **Radix Primitives**.
- **Backend:** Node.js + Express, interacting purely via the `pg` package to ensure lightweight, raw SQL queries.
- **Database:** PostgreSQL (Designed atop Supabase natively).

---

## 🚀 Local Setup

### 1. Database Preparation
Create a Supabase Postgres instance and run the provided SQL definitions (tables: `event_types`, `availability`, `bookings`).

### 2. Backend Initialization
```bash
cd backend
npm install
```
Create a `.env` file in the `/backend` directory:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-URL].supabase.co:5432/postgres
```
Start the API:
```bash
node server.js
```

### 3. Frontend Initialization
```bash
cd frontend
npm install
```
Start the Vite Development Server:
```bash
npm run dev
```

The application will be running at [http://localhost:5173](http://localhost:5173).

---

## 🛠️ Codebase Structure

```bash
/
├── backend/
│   ├── controllers/      # Route logic (events, availability, bookings, timeslots)
│   ├── routes/           # Express routers
│   ├── db.js             # pg pooling instance
│   └── server.js         # API Entry point
│
└── frontend/
    ├── src/
    │   ├── components/   # Reusable Layout, ThemeProviders, and standard UI blocks
    │   │   └── ui/       # Raw Shadcn primitives (Button, Card, Dialog, Calendar)
    │   ├── pages/        # Dashboard, Availability, BookingPage, BookingsList
    │   └── App.jsx       # React Router DOM definitions
    └── tailwind.config.js
```
