const { Client } = require('pg');
var fs = require("fs");
var async = require('async');
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


client
   .query("SELECT day, time_begin, time_end, location_name, address, meeting_type FROM meeting WHERE day = 'Mondays' and meeting_type = 'C';", (err, res) => {
    if(err) {throw err}
    console.table(res.rows);
    client.end();
});


