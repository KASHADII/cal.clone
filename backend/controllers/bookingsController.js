const pool = require('../db');

exports.createBooking = async (req, res) => {
  const { event_type_id, name, email, date, time } = req.body;
  try {
    // Check for double booking
    const existing = await pool.query(
      'SELECT id FROM bookings WHERE event_type_id = $1 AND date = $2 AND time = $3',
      [event_type_id, date, time]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Time slot already booked for this event and date.' });
    }

    const result = await pool.query(
      'INSERT INTO bookings (event_type_id, name, email, date, time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [event_type_id, name, email, date, time]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating booking' });
  }
};

exports.listBookings = async (req, res) => {
  try {
    // Join with event_types to get title
    const result = await pool.query(`
      SELECT b.*, e.title as event_title, e.duration 
      FROM bookings b
      JOIN event_types e ON b.event_type_id = e.id
      ORDER BY b.date DESC, b.time DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error listing bookings' });
  }
};

exports.cancelBooking = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM bookings WHERE id = $1', [id]);
    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error cancelling booking' });
  }
};
