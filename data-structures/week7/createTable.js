// This file is to create a table

const { Client } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'yiranni';
db_credentials.host = 'aameeting.cowtwtgreshm.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

var query = ""

query += "CREATE TABLE groups (\
                              group_id serial PRIMARY KEY,\
                              group_name varchar(200)\
                              );"
query += "CREATE TABLE zone (\
                              zone_id serial PRIMARY KEY,\
                              zone_name integer\
                              );"
query += "CREATE TABLE meeting (\
                              meeting_id serial PRIMARY KEY,\
                              meeting_type varchar(10),\
                              group_id integer REFERENCES groups (group_id),\
                              zone_id integer REFERENCES zone (zone_id),\
                              location_name varchar,\
                              address varchar,\
                              zip varchar(10),\
                              city varchar(100),\
                              state varchar(10),\
                              lat double precision,\
                              lng double precision,\
                              accessibility bool,\
                              day varchar(100),\
                              time_begin varchar(200),\
                              time_end varchar(200),\
                              specialInterest varchar(100)\
                              );"
                              

// query = "DROP TABLE zone; DROP TABLE groups;"
// query = "DROP TABLE meeting"; 



client.query(query, (err, res) => {
    console.log(err, res);
    client.end();
});

