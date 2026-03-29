const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  lookup: (hostname, options, callback) => {
    const opts = typeof options === 'number' ? { family: options } : (options || {});
    return dns.lookup(hostname, { ...opts, family: 4 }, callback);
  },
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
