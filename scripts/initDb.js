require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const runMigrations = async () => {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('✅ Database schema applied successfully.');
  } catch (err) {
    console.error('❌ Error applying schema:', err);
  }
};

const seedDatabase = async () => {
  try {
    const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    await pool.query(seed);
    console.log('✅ Seed data inserted successfully.');
  } catch (err) {
    console.error('❌ Error inserting seed data:', err);
  }
};

const initializeDatabase = async () => {
  await runMigrations();
  await seedDatabase();
  pool.end();
};

initializeDatabase();
