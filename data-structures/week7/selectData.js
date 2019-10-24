const { Client } = require('pg');
var fs = require("fs");
var async = require('async');

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


// Sample SQL statement to query the entire contents of a table: 
var thisQuery = "SELECT * FROM zone;";

client.query(thisQuery, (err, res) => {
    console.log(err, res.rows);
    // fs.appendFileSync('./data/AA05db.json', JSON.stringify(res.rows))
    client.end();
});
