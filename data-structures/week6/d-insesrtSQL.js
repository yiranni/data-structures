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


var m05Data = fs.readFileSync('/home/ec2-user/environment/data-structures/week6/data/m05.json');
var m05= JSON.parse(m05Data)

// console.log(m05)

async.eachSeries(m05, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO meeting VALUES (DEFAULT, '" + value.zone + "', '" + value.group + "', '" + value.address + "', '"+ value.locations + "', '" + value.latitude + "', '" + value.longitude + "', '" + value.accessibility + "', '"+value.day + "', '" + value.beginTime + "', '" + value.endTime + "', '" + value.meetingType + "', '" + value.specialInterest + "');";
    setTimeout(callback, 2000);
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
});

