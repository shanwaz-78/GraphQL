import { createPool } from 'mysql2';

function openConnection() {
  try {
    const config = {
      host: process.env.HOST,
      user: process.env.USER,
      database: process.env.DATABASE,
      password: process.env.PASSWORD,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
    const connection = createPool(config);
    return connection;
  } catch (error) {
    console.log('[Error]: while connecting to db:', error);
    throw error;
  }
}

export default openConnection;