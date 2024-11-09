import pg from 'pg'
import 'dotenv/config'

const {Pool} = pg

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const pool = new Pool(dbConfig)

export default pool;

// console.log(db)

// const queryText = 'INSERT INTO users(uid,name,interests) VALUES($1,$2,$3) RETURNING *'
// const vals = ['2', 'Steve', 14]

// const result = await db.query(queryText, vals)

// console.log(result)