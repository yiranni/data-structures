var express = require('express');
var app = express();
var path = require('path');
var moment = require('moment');
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

// console.log(tpdb_credentials);

// const checkPostgresConnectivity = async(psqlClient) => {
//     await psqlClient.query('SELECT NOW()', (err, res) => {
//         if (err) {
//             console.log("error:", err);
//         }
//         else {
//             console.log(res);
//         }
//     });
// }

// const main = async() => {
//     checkPostgresConnectivity(tpclient);
// }

// main();
// process.exit();g

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


app.use(express.static('public'));


////////////////////////////////////////////////////////////////////////////////
// Landing Page

app.get('', function(req, res) {
    var output = "<head> " +
        `<link rel="stylesheet" type="text/css"   href="/style.css">` +
        `<link href="https://fonts.googleapis.com/css?family=Noto+Sans+JP:100,300,400,500,700,900&display=swap" rel="stylesheet">` +
        `  </head> \
                <body> \
                    <header> \
                        <span>D/S</span> \
                        <nav>
                        <ul> \
                          <li><a href="/">Home</a></li> \
                          <li><a href="/blog">Diary</a></li> \
                          <li><a href="/meeting">Meeting</a></li> \
                          <li><a href="/sensor">Sensor</a></li> \
                          <li><a href="/test">Test</a></li> \
                        </ul> \
                        </nav> \
                    </header> \
                </body> \
                  `;
    res.send(output);

});

////////////////////////////////////////////////////////////////////////////////
// Dear Diary

app.get('/blog', function(req, res) {
    var output = " <head> " +
        `<link rel="stylesheet" type="text/css"   href="/style.css">` +
        `<link href="https://fonts.googleapis.com/css?family=Noto+Sans+JP:100,300,400,500,700,900&display=swap" rel="stylesheet">` +
        ` </head> \
          <body> \
           <header> \
                <span>D/S</span> \
                <nav>
                <ul> \
                  <li><a href="/">Home</a></li> \
                  <li><a href="/blog">Diary</a></li> \
                  <li><a href="/meeting">Meeting</a></li> \
                  <li><a href="/sensor">Sensor</a></li> \
                </ul> \
                </nav> \
            </header> \
              <h1>Dear Diary</h1> 
              <div class="diary">
          `;
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
            console.log("Open Dear Diary...");
            data.Items.forEach(function(item) {
                output += `<div class="entry"><div class="line"></div>`
                output += `<div class='date'>` +
                    `<p class='day'>` +
                    item.date.S.split('/')[1] +
                    `</p>` +
                    `<p class='month'>` + moment(item.date.S).format('dddd') + '<br>' +
                    months[parseInt(item.date.S.split('/')[0]) - 1] + " " + item.date.S.split('/')[2].split(',')[0] +
                    `</p>` +
                    `</div>`;
                output += `<div class="details"><p class="topic">Topic</p><p class="more">` + item.entry.S + `</p></div>` + `</div>`;

                // output += '<p>' + item.entry.S + '</p>\n </div>';
            });
            output += "</div></body>";
            res.send(output);

        }
    });

});

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
                                <td>" + item.day + "</td> \
                                <td>" + item.time_begin + "</td> \
                                <td>" + item.time_end + "</td> \
                                <td>" + item.location_name + "</td> \
                                <td>" + item.address + "</td> \
                                <td>" + item.meeting_type + "</td> \
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
            console.log("Open Temperature Sensor...");

            output += "<table> \
                      <tr> \
                        <th>Time</th> \
                        <th>Temperature</th> \
                      </tr>"
            data.rows.forEach(function(item) {
                output += "<tr> \
                                <td>" + item.sensortime + "</td> \
                                <td>" + item.result + "</td> \
                            </tr>";

            });
            output += "</table><div class='button-wrapper'><a class='button' href='/'>Homepage</a></div></body>";
            res.send(output);

        }
    });

});


////////////////////////////////////////////////////////////////////////////////
// test page
// create templates
var hx = `<!doctype html>
            <html lang="en">
            <head>
              <meta charset="utf-8">
              <title>AA Meetings</title>
              <meta name="description" content="Meetings of AA in Manhattan">
              <meta name="author" content="AA">
              <link rel="stylesheet" href="/styles.css?v=1.0">
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
                   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
                   crossorigin=""/>
            </head>
            <body>
            <div id="mapid"></div>
            <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
               integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
               crossorigin=""></script>
            <script>
                var data = 
  `;

var jx = `;
    var mymap = L.map('mapid').setView([40.734636,-73.994997], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoieWlyYW5uaSIsImEiOiJjazNhcWZteWQwZnhvM2NuNHl1dW13OTY2In0.xzorm2DBaYf4bJMqxiF6iQ'
    }).addTo(mymap);
    for (var i=0; i<data.length; i++) {
        L.marker( [data[i].lat, data[i].lon] ).bindPopup(JSON.stringify(data[i].meetings)).addTo(mymap);
    }
    </script>
    </body>
    </html>`;


// respond to requests for /aa
app.get('/aa', function(req, res) {

    var now = moment.tz(Date.now(), "America/New_York");
    var dayy = now.day().toString();
    var hourr = now.hour().toString();

    // Connect to the AWS RDS Postgres database
    // const client = new Pool(db_credentials);

    // SQL query 
    var thisQuery = `SELECT lat, lng, json_agg(json_build_object('loc', location_name, 'address', address, 'day', day, 'types', types)) as meetings
                 FROM meeting
                 WHERE meeting_type = 'C'
                 ;`;

    aaclient.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }

        else {
            var resp = hx + JSON.stringify(qres.rows) + jx;
            res.send(resp);
            // client.end();
            console.log('AA) responded to request for aa meeting data');
        }
    });
});


app.listen(8080, function() {
    console.log('listen on 8080')
});
