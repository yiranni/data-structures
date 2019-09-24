const { Client } = require('pg');
var fs = require("fs");
var async = require('async');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'yiranni';
db_credentials.host = 'data-structures.cowtwtgreshm.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
// db_credentials.password = process.env.AWSRDS_PW;
db_credentials.password = "Niyiran971022!";

db_credentials.port = 5432;

// const path = '/home/ec2-user/environment/data-structures/data/m05meetingAddress-latlong.json';
// var allData = undefined;
// fs.readFile(path, 'utf-8', function(err, data) {
//     if (err) { 
//         console.log('cannot read json');
//         callback(err, null); 
//     } else {
//         allData = JSON.parse(rawData);
//     }
// })

// async.eachSeries(allData, function(value, callback) {
//     const client = new Client(db_credentials);
//     client.connect();

//     var thisQuery = "INSERT INTO aalocations VALUES (E'" + value.address + "', " + value.latLong.lat + ", " + value.latLong.lng + ");";
//     client.query(thisQuery, (err, res) => {
//         console.log(err, res);
//         client.end();
//     });
//     setTimeout(callback, 1000); 
// }); 

var allAddressesData = fs.readFileSync('/home/ec2-user/environment/data-structures/week4/data/AA-data-m05.json');
var allAddresses = JSON.parse(allAddressesData)
// console.log(allAddresses)
// var addressesForDb = [ { address: '63 Fifth Ave, New York, NY', latLong: { lat: 40.7353041, lng: -73.99413539999999 } }, { address: '16 E 16th St, New York, NY', latLong: { lat: 40.736765, lng: -73.9919024 } }, { address: '2 W 13th St, New York, NY', latLong: { lat: 40.7353297, lng: -73.99447889999999 } } ];

async.eachSeries(allAddresses, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO aalocations VALUES ('" + value.address + "', " + "'" + value.city + "', " +  "'" + value.state + "', " + value.zip  + ", " + value.latitude + ", " + value.longitude + ");";
    console.log(thisQuery)
    console.log('done');
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 