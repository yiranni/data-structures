var express = require('express');
var app = express();
var path = require('path');
const dotenv = require('dotenv');
dotenv.config();


// AWS Setup
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";
var dynamodb = new AWS.DynamoDB();

// AWS RDS POSTGRESQL INSTANCE FOR AA MEETING
const { Client } = require('pg');
var aadb_credentials = new Object();
aadb_credentials.user = process.env.AWSRDS_USER;
aadb_credentials.host = process.env.AWSRDS_AAHOST;
aadb_credentials.database = process.env.AWSRDS_AADB;
aadb_credentials.password = process.env.AWSRDS_PW;
aadb_credentials.port = 5432;
const aaclient = new Client(aadb_credentials);
aaclient.connect();

// AWS RDS POSTGRESQL INSTANCE FOR TEMP SENSOR
var tpdb_credentials = new Object();
tpdb_credentials.user = process.env.AWSRDS_USER;
tpdb_credentials.host = process.env.AWSRDS_TEMPHOST;
tpdb_credentials.database = process.env.AWSRDS_TEMPDB;
tpdb_credentials.password = process.env.AWSRDS_PW;
tpdb_credentials.port = 5432;
const tpclient = new Client(tpdb_credentials);
tpclient.connect();

console.log(tpdb_credentials);

const checkPostgresConnectivity = async(psqlClient) => {
    await psqlClient.query('SELECT NOW()', (err, res) => {
      if (err) {
        console.log("error:", err);
      } else {
        console.log(res);
      }
    });
}

// const main = async() => { 
//     checkPostgresConnectivity(tpclient);
// }

// main();
// process.exit();


////////////////////////////////////////////////////////////////////////////////
// Landing Page


// app.use(express.static('public'));

app.get('', function(req, res) {
    var output = " \
                  <head> \
                  <link href='https://fonts.googleapis.com/css?family=Poppins:300,300i,400,400i,500,500i,600,600i,700&display=swap' rel='stylesheet'> \
                      <style> \
                          body {padding-top: 50px; \
                                 padding-left: 20vw; \
                                padding-right: 20vw; \
                                font-family: 'Poppins', sans-serif } \
                          h1 {font-family: 'Poppins', sans-serif} \
                          .button { \
                            background-color: #4CAF50; \
                            border: none; \
                            color: black; \
                            padding: 15px 60px; \
                            text-align: center; \
                            text-decoration: none; \
                            display: inline-block; \
                            font-size: 16px; \
                            margin: 10px 10px; \
                            cursor: pointer; \
                            left: 50%; \
                            font-size: 16px; \
                            font-weight: 300; \
                            color: white; \
                            width: 120px; \
                            } \
                            .button-wrapper { \
                                text-align: center; \
                                padding-top: 50px; \
                            } \
                      </style> \
                  </head> \
                  <body> \
                      <h1>Data Structure Projects</h1> \
                      <div class='button-wrapper'> \
                        <a class='button' href='/blog'>Dear Diary</a> \
                        <a class='button' href='/meeting'>AA Meeting</a> \
                        <a class='button' href='/sensor'>Temp Sensor</a> \
                      </div> \
                  </body> \
                  ";
    res.send(output);

});

////////////////////////////////////////////////////////////////////////////////
// Dear Diary

app.get('/blog', function(req, res) {
    var output = " \
                   <head> \
                      <link href='https://fonts.googleapis.com/css?family=Poppins:300,300i,400,400i,500,500i,600,600i,700&display=swap' rel='stylesheet'> \
                      <style> \
                          body {padding-top: 50px; \
                                padding-left: 20vw; \
                                padding-right: 20vw; \
                                font-family: 'Poppins', sans-serif } \
                          h1 {font-family: 'Poppins', sans-serif} \
                         .button { \
                            background-color: #4CAF50; \
                            border: none; \
                            color: black; \
                            padding: 15px 60px; \
                            text-align: center; \
                            text-decoration: none; \
                            display: inline-block; \
                            font-size: 16px; \
                            margin: 10px 10px; \
                            cursor: pointer; \
                            left: 50%; \
                            font-size: 16px; \
                            font-weight: 300; \
                            color: white; \
                            width: 120px; \
                            } \
                            .button-wrapper { \
                                text-align: center; \
                                padding-top: 50px; \
                            } \
                            .date { \
                                font-weight: 300i; \
                            } \
                            p { \
                                font-weight: 300; \
                            } \
                      </style> \
                  </head> \
                  <body> \
                      <h1>Dear Diary</h1> \
                  ";
    var params = {
        TableName: "deardiary",
        KeyConditionExpression: "#tp = :categoryName", // the query expression
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#tp": "category",
        },
        ExpressionAttributeValues: { // the query values
            ":categoryName": { S: "badminton" },
        }
    };

    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                output += "<p class='date'>" + item.date.S + "</p>\n";

                output += '<p>' + item.entry.S + '</p>\n';
            });
            output += "<div class='button-wrapper'><a class='button' href='/'>Homepage</a></div></body>";
            res.send(output);

        }
    });


    //  res.send(output);
});


////////////////////////////////////////////////////////////////////////////////
// AA Meeting
app.get('/meeting', function(req, res) {
    var thisQuery = "SELECT day, \
                    time_begin, \
                    time_end, \
                    location_name, \
                    address, \
                    meeting_type \
                    FROM meeting \
                    WHERE \
                    day = 'Mondays' \
                    and \
                    meeting_type = 'C'\
                    ;"
    var output = " \
                  <head> \
                  <link href='https://fonts.googleapis.com/css?family=Poppins:300,300i,400,400i,500,500i,600,600i,700&display=swap' rel='stylesheet'> \
                      <style> \
                          body {padding-top: 50px; \
                                padding-left: 20vw; \
                                padding-right: 20vw; \
                                font-family: 'Poppins', sans-serif } \
                          h1 {font-family: 'Poppins', sans-serif} \
                         .button { \
                            background-color: #4CAF50; \
                            border: none; \
                            color: black; \
                            padding: 15px 60px; \
                            text-align: center; \
                            text-decoration: none; \
                            display: inline-block; \
                            font-size: 16px; \
                            margin: 10px 10px; \
                            cursor: pointer; \
                            left: 50%; \
                            font-size: 16px; \
                            font-weight: 300; \
                            color: white; \
                            width: 120px; \
                            } \
                            .button-wrapper { \
                                text-align: center; \
                                padding-top: 50px; \
                            } \
                            table { \
                              border-collapse: collapse; \
                              width: 100%; \
                              font-weight: 300; \
                              font-size: 14px; \
                            } \
                            td, th { \
                              border: 1px solid #dddddd; \
                              text-align: left; \
                              padding: 8px; \
                            } \
                            tr:nth-child(even) { \
                              background-color: #dddddd; \
                            } \
                      </style> \
                  </head> \
                  <body> \
                      <h1>AA Meeting</h1> \
                      <p>Day: Mondays</p> \
                      <p>Meeting Type: C</p> \
                  ";

    


    aaclient.query(thisQuery, function(err, data) {
        
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            console.log("Query succeeded.");
            output += "<table> \
                      <tr> \
                        <th>Day</th> \
                        <th>Start at</th> \
                        <th>End at</th> \
                        <th>Location</th> \
                        <th>Addreess</th> \
                        <th>Type</th> \
                      </tr>"
            data.rows.forEach(function(item) {
                output += "<tr> \
                                <td>" + item.day+ "</td> \
                                <td>" + item.time_begin+ "</td> \
                                <td>" + item.time_end+ "</td> \
                                <td>" + item.location_name+ "</td> \
                                <td>" + item.address+ "</td> \
                                <td>" + item.meeting_type+ "</td> \
                            </tr>";

                // output += '<p>' + item.entry.S + '</p>\n';
            });
            output += "</table><div class='button-wrapper'><a class='button' href='/'>Homepage</a></div></body>";
            res.send(output);

        }
    });


});



////////////////////////////////////////////////////////////////////////////////
// Temp Sensor 
app.get('/sensor', function(req, res) {
    var output = " \
                  <head> \
                    <link href='https://fonts.googleapis.com/css?family=Poppins:300,300i,400,400i,500,500i,600,600i,700&display=swap' rel='stylesheet'> \
                      <style> \
                          body {padding-top: 50px; \
                                padding-left: 20vw; \
                                padding-right: 20vw; \
                                font-family: 'Poppins', sans-serif } \
                          h1 {font-family: 'Poppins', sans-serif} \
                          .button { \
                            background-color: #4CAF50; \
                            border: none; \
                            color: black; \
                            padding: 15px 60px; \
                            text-align: center; \
                            text-decoration: none; \
                            display: inline-block; \
                            font-size: 16px; \
                            margin: 4px 2px; \
                            cursor: pointer; \
                            left: 50%; \
                            font-size: 16px; \
                            font-weight: 300; \
                            color: white \
                            } \
                            .button-wrapper { \
                                text-align: center; \
                                padding-top: 50px; \
                            } \
                             table { \
                              border-collapse: collapse; \
                              width: 100%; \
                              font-weight: 300; \
                              font-size: 14px; \
                            } \
                            td, th { \
                              border: 1px solid #dddddd; \
                              text-align: left; \
                              padding: 8px; \
                            } \
                            tr:nth-child(even) { \
                              background-color: #dddddd; \
                            } \
                      </style> \
                  </head> \
                  <body> \
                      <h1>Temperature Sensor</h1>\
                  ";

    var thisQuery = "SELECT sensortime, \
                    result \
                    FROM sensorData \
                    WHERE \
                    result>20\
                    ;"
                    
    tpclient.query(thisQuery, function(err, data) {
        
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            console.log("Temp Query succeeded.");
            
            output += "<table> \
                      <tr> \
                        <th>Time</th> \
                        <th>Temperature</th> \
                      </tr>"
            console.log(data.rows)
            data.rows.forEach(function(item) {
                console.log(item.result)
                output += "<tr> \
                                <td>" + item.sensortime+ "</td> \
                                <td>" + item.result+ "</td> \
                            </tr>";

            });
            output += "</table><div class='button-wrapper'><a class='button' href='/'>Homepage</a></div></body>";
            res.send(output);

        }
    });

});



app.listen(8080);