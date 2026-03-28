const express = require('express');
const cors = require('cors');
require('dotenv').config();

const eventsRoutes = require('./routes/events');
const availabilityRoutes = require('./routes/availability');
const bookingsRoutes = require('./routes/bookings');
const timeSlotsRoutes = require('./routes/timeSlots');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.FRONTEND_URL 
    ? [process.env.FRONTEND_URL, 'http://localhost:5173'] 
    : '*',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/events', eventsRoutes);
app.use('/availability', availabilityRoutes);
app.use('/bookings', bookingsRoutes);
app.use('/timeslots', timeSlotsRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
