const mysql = require('mysql2/promise');
async function test() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
    });
    const [rows] = await conn.query('SHOW DATABASES');
    console.log('Databases:', rows.map(r => r.Database));
    await conn.end();
  } catch (err) {
    console.error('DB Error:', err.message);
  }
}
test();
