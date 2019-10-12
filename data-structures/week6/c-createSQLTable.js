// This file is to create a table

const { Client } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'yiranni';
db_credentials.host = 'aameeting.cowtwtgreshm.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = 'Niyiran971022!';
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

var query = ""
query += "CREATE TABLE meeting (\
                                id serial PRIMARY KEY,\
                                zone SMALLINT,\
                                groups VARCHAR(200),\
                                address VARCHAR(200),\
                                locations VARCHAR(200),\
                                latitude DOUBLE precision,\
                                longitude DOUBLE precision,\
                                accessibility BOOLEAN,\
                                day VARCHAR(10),\
                                beginTime VARCHAR(20),\
                                endTime VARCHAR(20),\
                                meetingType VARCHAR(10),\
                                 specialInterest VARCHAR(100));"

// query = "DROP TABLE meeting;"; 



client.query(query, (err, res) => {
    console.log(err, res);
    client.end();
});

// query = 'SELECT * FROM INFORMATION_SCHEMA.COLUMNS';