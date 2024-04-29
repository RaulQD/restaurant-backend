
import mysql from 'mysql2/promise';
import 'dotenv/config';

const config = {
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'sistema_restaurant',
    port: 3306
}

const conn = await mysql.createConnection(config);

export default conn;