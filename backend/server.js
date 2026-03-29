const express = require('express');
const cors = require('cors');
require('dotenv').config();

const eventsRoutes = require('./routes/events');
const availabilityRoutes = require('./routes/availability');
const bookingsRoutes = require('./routes/bookings');
const timeSlotsRoutes = require('./routes/timeSlots');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (origin === 'http://localhost:5173') return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ ok: true, message: 'Cal.clone backend is running' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/events', eventsRoutes);
app.use('/availability', availabilityRoutes);
app.use('/bookings', bookingsRoutes);
app.use('/timeslots', timeSlotsRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
