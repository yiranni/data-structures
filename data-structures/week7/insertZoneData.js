const { Client } = require('pg');
const pgp = require('pg-promise')();
const db = pgp;
var fs = require("fs");
var async = require('async');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'yiranni';
db_credentials.host = 'aameeting.cowtwtgreshm.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;;
db_credentials.port = 5432;

const allmtgs = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data-structures/week7/data/allmeetings.json'));

async.eachSeries(allmtgs, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO zone (zone_id, zone_name) VALUES (DEFAULT, " + value.zone + ")";
    setTimeout(callback, 2000);
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });

});