const app = require('./app');
const PORT = process.env.PORT || 4000;
const db = require('./config/db');

app.listen(PORT, (error) => {
  error
    ? console.error('Error starting up server: ', error.message)
    : console.log(`Server running on ${PORT}`);
  
  // Test database connection
  (async () => {
    try {
      const connection = await db.getConnection();
      console.log('Database connected successfully!');
      connection.release();
    } catch (err) {
      console.error('Database connection error:', err);
    }
  })();
});
