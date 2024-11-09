import pg from 'pg'
const {Pool} = pg

const dbConfig = {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'data',
    database: 'hackathon'
};

const pool = new Pool(dbConfig)

export default pool;

// console.log(db)

// const queryText = 'INSERT INTO users(uid,name,interests) VALUES($1,$2,$3) RETURNING *'
// const vals = ['2', 'Steve', 14]

// const result = await db.query(queryText, vals)

// console.log(result)