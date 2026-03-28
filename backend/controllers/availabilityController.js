const pool = require('../db');

exports.saveAvailability = async (req, res) => {
  const { day_of_week, start_time, end_time, timezone } = req.body;
  try {
    // Upsert availability for a day of week
    const result = await pool.query(
      `INSERT INTO availability (day_of_week, start_time, end_time, timezone)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (day_of_week) DO UPDATE 
       SET start_time = EXCLUDED.start_time,
           end_time = EXCLUDED.end_time,
           timezone = EXCLUDED.timezone
       RETURNING *`,
      [day_of_week, start_time, end_time, timezone || 'UTC']
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error saving availability' });
  }
};

exports.getAvailability = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM availability ORDER BY day_of_week ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching availability' });
  }
};
