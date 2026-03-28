const pool = require('../db');

exports.createEvent = async (req, res) => {
  const { title, description, duration, slug } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO event_types (title, description, duration, slug) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, duration, slug]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating event' });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM event_types ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching events' });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, duration, slug } = req.body;
  try {
    const result = await pool.query(
      'UPDATE event_types SET title = $1, description = $2, duration = $3, slug = $4 WHERE id = $5 RETURNING *',
      [title, description, duration, slug, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating event' });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM event_types WHERE id = $1', [id]);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting event' });
  }
};
