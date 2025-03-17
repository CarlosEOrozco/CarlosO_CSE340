// database/index.js
const { Pool } = require("pg");
require("dotenv").config();

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "development" ? { rejectUnauthorized: false } : false,
});

// Added for troubleshooting queries
// during development - remove in production
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      console.log("executed query", { text });
      return res;
    } catch (error) {
      console.error("error in query", { text });
      throw error;
    }
  },
};