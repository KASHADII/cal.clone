const pool = require('../db');

exports.getAvailableSlots = async (req, res) => {
  const { date, event_type_id } = req.query;

  if (!date || !event_type_id) {
    return res.status(400).json({ error: 'Missing date or event_type_id' });
  }

  try {
    // 1. Get event duration
    const eventRes = await pool.query('SELECT duration FROM event_types WHERE id = $1', [event_type_id]);
    if (eventRes.rows.length === 0) {
      return res.status(404).json({ error: 'Event type not found' });
    }
    const durationMins = eventRes.rows[0].duration;

    // 2. Get day of week (0=Sun, 6=Sat)
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    const dayOfWeek = d.getUTCDay();

    // 3. Get availability for this day of week
    const availRes = await pool.query('SELECT start_time, end_time FROM availability WHERE day_of_week = $1', [dayOfWeek]);
    if (availRes.rows.length === 0) {
      return res.json([]); // No availability for this day
    }
    const { start_time, end_time } = availRes.rows[0];

    // 4. Get bookings for this date across ALL events to avoid overlapping
    const bookingsRes = await pool.query(`
      SELECT b.time, e.duration 
      FROM bookings b
      JOIN event_types e ON b.event_type_id = e.id
      WHERE b.date = $1
    `, [date]);
    const bookings = bookingsRes.rows;

    const timeToMins = (tStr) => {
      const [h, m, s] = tStr.split(':').map(Number);
      return h * 60 + m + (s ? s / 60 : 0);
    };

    const minsToTime = (m) => {
      const hh = String(Math.floor(m / 60)).padStart(2, '0');
      const mm = String(m % 60).padStart(2, '0');
      return `${hh}:${mm}:00`;
    };

    const startMins = timeToMins(start_time);
    const endMins = timeToMins(end_time);

    let slots = [];
    for (let current = startMins; current + durationMins <= endMins; current += 30) {
      // Step by 30 mins normally, or by duration. Let's do 30 mins stepping 
      // as it provides more flexible starts, but slot length covers duration.
      // E.g., if duration is 60, slots at 10:00, 10:30, 11:00... but 10:30 blocks until 11:30.
      const slotStart = current;
      const slotEnd = current + durationMins;

      // Stop if the slot goes past the end_time
      if (slotEnd > endMins) break;

      let isOverlap = false;
      for (const b of bookings) {
        const bStart = timeToMins(b.time);
        const bEnd = bStart + b.duration;
        if (slotStart < bEnd && slotEnd > bStart) {
          isOverlap = true;
          break;
        }
      }

      if (!isOverlap) {
        slots.push(minsToTime(current));
      }
    }

    res.json(slots);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error generating slots' });
  }
};
