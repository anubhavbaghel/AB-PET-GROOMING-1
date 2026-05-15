const mysql = require('mysql2/promise');
async function test() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'ab_pet_grooming'
    });
    const [rows] = await conn.query('SHOW TABLES');
    console.log('Tables:', rows);
    await conn.end();
  } catch (err) {
    console.error('DB Error:', err.message);
  }
}
test();
