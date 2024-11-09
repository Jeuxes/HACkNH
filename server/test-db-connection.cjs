const { Client } = require('pg');

const dbConfig = {
  host: 'database-1.cluster-ro-c58y6k84gsap.us-east-1.rds.amazonaws.com',
  port: 5432,
  user: 'postgres',
  password: 'WheresWildcat1',
  database: 'database-1'
};

const client = new Client(dbConfig);

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
    return client.query('SELECT version();');
  })
  .then(result => {
    console.log('Database version:', result.rows[0].version);
  })
  .catch(error => {
    console.error('Error connecting to the database:', error);
  })
  .finally(() => {
    client.end();
  });


  