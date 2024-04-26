
import mysql from 'mysql2/promise';
import 'dotenv/config';

const config = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: 3306
}

const conn = await mysql.createConnection(config);

export default conn;