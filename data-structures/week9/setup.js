// This file is to create a table
const dotenv = require('dotenv');
dotenv.config();
const { Client } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = process.env.AWSRDS_USER;
db_credentials.host = process.env.AWSRDS_HOST;
db_credentials.database = process.env.AWSRDS_DB;
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = process.env.AWSRDS_PORT;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

const query = "CREATE TABLE sensorData (\
                _id serial PRIMARY KEY,\
                cmd varchar(100),\
                name varchar(100),\
                result double precision,\
                sensorTime timestamp DEFAULT current_timestamp\
                );"

client.query(query, (err, res) => {
    console.log(err, res);
    client.end();
});

