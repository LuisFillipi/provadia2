// com base na atividade do "desapega"!

import mysql from "mysql2"

const conn = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT
})

conn.query((err) => {
    if (err) {
        console.error(err);
        return
    }
    console.log('Conectado ao MySQL!');
  });
  
export default conn;