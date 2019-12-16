var express = require('express');
var app = express();
var path = require('path');
var moment = require('moment-timezone');
const dotenv = require('dotenv');
dotenv.config();
var fs = require('fs');
var handlebars = require('handlebars');


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
                    <main style="padding-left: 50px; padding-bottom: 200px">
                    <h1>Data Structure Final Project Showcase</h1>
                    <div style="padding-left: 50px; padding-right: 50px">
                    <div>
                    <h2>Project 1- AA Meeting</h2>
                    <p class="project-intro">This project is based on New York Intergroup Meeting data. However, the data provided by the New York Intergroup is too much that you may not able to filter out. This project helps you to find meeting that happened or is going to happen today.</p>
                    <a href="/meeting">Go check today's meeting!</a>
                    </div>
                    <div>
                    <h2>Project 2- Diary</h2>
                    <p class="project-intro">This project documented my diary in different fields. Now, it includes two categories: badminton and study. Let's check out some of my interesting life events!</p>
                    <a href="/blogBadminton">badminton</a>
                    <a href="/blogStudy">study</a>
                    </div>
                    <div>
                    <h2>Project 3- Temperature Sensor</h2>
                    <p class="project-intro">This project recorded the temperature in my bedroom via IoT temperature sensor device. I compared the temperature recorded from the IoT and compared it to the outside temperature to see the difference between indoor and outdoor temperature.</p>
                    <a href="/sensor">Go check the temperature</a>
                    </div>
                    </div>
                    </main>
                </body> \
                  `;
    res.send(output);

});

////////////////////////////////////////////////////////////////////////////////
// Dear Diary

app.get('/blogBadminton', function(req, res) {
    var output = " <head> " +
        `<link rel="stylesheet" type="text/css"   href="/style.css">` +
        `<link href="https://fonts.googleapis.com/css?family=Noto+Sans+JP:100,300,400,500,700,900&display=swap" rel="stylesheet">` +
        ` </head> \
          <body> \
            
             <div style="display: flex; flex-direction: row ">
            
            <h1 style="flex:1">Dear Diary</h1>
            <a class = "homeButton" href='/'>Go Back</a>
            
            </div>
              <div id="diaryFilter">
              <p>Category: badminton</p>
                </div>
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

app.get('/blogStudy', function(req, res) {
    var output = " <head> " +
        `<link rel="stylesheet" type="text/css"   href="/style.css">` +
        `<link href="https://fonts.googleapis.com/css?family=Noto+Sans+JP:100,300,400,500,700,900&display=swap" rel="stylesheet">` +
        ` </head> \
          <body> \
            
             <div style="display: flex; flex-direction: row ">
            
            <h1 style="flex:1">Dear Diary</h1>
            <a class = "homeButton" href='/'>Go Back</a>
            
            </div>
              <div id="diaryFilter">
              <p>Category: study</p>
                </div>
              <div class="diary">
          `;
    var params = {
        TableName: "deardiary",
        KeyConditionExpression: "#tp = :categoryName", // the query expression
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#tp": "category",
        },
        ExpressionAttributeValues: { // the query values
            ":categoryName": { S: "study" },
        }
    };

    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            console.log("Open Dear Diary...");
            console.log()
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




////////////////////////////////////////////////////////////////////////////////
// Temp Sensor 
const indexSensor = fs.readFileSync("sensor.txt").toString();
var templateSensor = handlebars.compile(indexSensor, { strict: true });
app.get('/sensor', function(req, res) {
    // var output = " \
    //               <head> \
    //                 <link href='https://fonts.googleapis.com/css?family=Poppins:300,300i,400,400i,500,500i,600,600i,700&display=swap' rel='stylesheet'> \
    //                   <style> \
    //                       body {padding-top: 50px; \
    //                             padding-left: 20vw; \
    //                             padding-right: 20vw; \
    //                             font-family: 'Poppins', sans-serif } \
    //                       h1 {font-family: 'Poppins', sans-serif} \
    //                       .button { \
    //                         background-color: #4CAF50; \
    //                         border: none; \
    //                         color: black; \
    //                         padding: 15px 60px; \
    //                         text-align: center; \
    //                         text-decoration: none; \
    //                         display: inline-block; \
    //                         font-size: 16px; \
    //                         margin: 4px 2px; \
    //                         cursor: pointer; \
    //                         left: 50%; \
    //                         font-size: 16px; \
    //                         font-weight: 300; \
    //                         color: white \
    //                         } \
    //                         .button-wrapper { \
    //                             text-align: center; \
    //                             padding-top: 50px; \
    //                         } \
    //                          table { \
    //                           border-collapse: collapse; \
    //                           width: 100%; \
    //                           font-weight: 300; \
    //                           font-size: 14px; \
    //                         } \
    //                         td, th { \
    //                           border: 1px solid #dddddd; \
    //                           text-align: left; \
    //                           padding: 8px; \
    //                         } \
    //                         tr:nth-child(even) { \
    //                           background-color: #dddddd; \
    //                         } \
    //                   </style> \
    //               </head> \
    //               <body> \
    //                   <h1>Temperature Sensor</h1>\
    //               ";

    var thisQuery = `SELECT EXTRACT(DAY  FROM sensortime) as sensorday,
                     AVG(result::int) as num_obs 
                     FROM sensorData 
                     WHERE _id > 100
                     GROUP BY sensorday
                    ORDER BY sensorday;
                    ;`

    tpclient.query(thisQuery, function(err, data) {

        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            res.end(templateSensor({ sensordata: JSON.stringify(data.rows)}));
            tpclient.end();

            console.log("Open Temperature Sensor...");

            // output += "<table> \
            //           <tr> \
            //             <th>Time</th> \
            //             <th>Temperature</th> \
            //           </tr>"
            // data.rows.forEach(function(item) {
            //     output += "<tr> \
            //                     <td>" + item.sensortime + "</td> \
            //                     <td>" + item.result + "</td> \
            //                 </tr>";

            // });
            // output += "</table><div class='button-wrapper'><a class='button' href='/'>Homepage</a></div></body>";
            // res.send(output);

        }
    });

});


////////////////////////////////////////////////////////////////////////////////
// AA Meeting
var hx = `<!doctype html>
            <html lang="en">
            <head>
              <meta charset="utf-8">
              <title>AA Meetings</title>
              <meta name="description" content="AA Meeting">
              <meta name="author" content="AA">
              <link rel="stylesheet" href="/style.css?v=1.0">
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
                   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
                   crossorigin=""/>
            </head>
            <body>
            
            <div height="40%">
            <div style="display: flex; flex-direction: row ">
            
            <h1 style="flex:1">AA Meeting</h1>
            <a class = "homeButton" href='/'>Go Back</a>
            
            </div>
            <p style="padding-bottom: 40px; padding-left: 50px">Let's find meetings today!</p>
            
            
            </div>
            <div id="map">
            
            
            
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
        var a = data[i].meetings;
        
        var popup = '';
        for(var j = 0; j < a.length; j++) {
            
            if(j == 0) {
            popup += '<h3>' + a[j].loc + '</h3>';
            popup += '<p>' + a[j].address + '</p>';
            }
        }
        L.marker( [data[i].lat, data[i].lng] ).bindPopup(popup).addTo(mymap);
    }
    </script>
    </div>
    </body>
    </html>`;


// respond to requests for /aa
app.get('/meeting', async function(req, res) {

    var now = moment.tz(Date.now(), "America/New_York");
    var nowDate = now.format("YYYY-MM-DD hh:mm dddd")
    var dayy = nowDate.split(" ").pop() + "s";
    const day = ` '${dayy}' `
    // var dayy = now.day().toString();
    var hourr = now.hour().toString();

    console.log(dayy)

    // Connect to the AWS RDS Postgres database
    // const client = new Pool(db_credentials);

    // SQL query 
    const jsonObject = "json_agg(json_build_object('loc', location_name, 'address', address, 'day', day, 'types', meeting_type, 'start_time', time_begin))";
    const baseQuery = "SELECT lat, lng, " + jsonObject + " as meetings FROM meeting WHERE meeting.day = "
    const thisQuery = baseQuery + day + "GROUP BY lat, lng;"

    await aaclient.query(thisQuery, (qerr, qres) => {

        console.log(thisQuery)

        if (qerr) { throw qerr }

        else {
            // console.log(qres.rows)
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

// <div id="filter">
//                 <h1>AA Meeting Search</h1>
//                 <div id="timeFilter" style="display: flex; flex-direction: row">
//                 <p>Start at</p>
//                 <select>
//                     <option value="1">8 am</option>
//                     <option value="2">9 am</option>
//                     <option value="3">10 am</option>
//                     <option value="4">11 am</option>
//                     <option value="5">12 pm</option>
//                     <option value="6">1 pm</option>
//                     <option value="7">2 pm</option>
//                     <option value="8">3 pm</option>
//                     <option value="9">4 pm</option>
//                     <option value="10">5 pm</option>
//                     <option value="11">6 pm</option>
//                     <option value="12">7 pm</option>
//                     <option value="13">8 pm</option>
//                     <option value="14">9 pm</option>
//                     <option value="15">10 pm</option>
//                     <option value="16">11 pm</option>
//                     <option value="17">0 am</option>
//                     <option value="18">1 am</option>
//                     <option value="19">2 am</option>
//                     <option value="20">3 am</option>
//                     <option value="21">4 am</option>
//                     <option value="22">5 am</option>
//                      <option value="23">6 am</option>
//                       <option value="24">7 am</option>

//                 </select>
//                 </div>
//                 <div id="dayFilter">
//                     <form id="form" data-toggle="buttons">
//                       <label>
//                         <input type="checkbox" name="myCheckBox" value="Monday">Monday<br>
//                       </label>
//                       <label>
//                         <input type="checkbox" name="myCheckBox" value="Tuesday">Tuesday<br>
//                       </label>
//                       <label class="btn btn-secondary active">
//                         <input type="checkbox" name="myCheckBox" value="Wednesday">Wednesday<br>
//                       </label>
//                       <label>
//                         <input type="checkbox" name="myCheckBox" value="Thursday">Thursday<br>
//                       </label>
//                       <label>
//                         <input type="checkbox" name="myCheckBox" value="Friday">Friday<br>
//                       </label>
//                       <label class="btn btn-secondary active">
//                         <input type="checkbox" name="myCheckBox" value="Saturday">Saturday<br>
//                       </label>
//                       <label>
//                         <input type="checkbox" name="myCheckBox" value="Sunday">Sunday<br>
//                       </label>
//                     </form>
//                 </div>
//                 <div class="line"></div>
//                 <div id="result">
//                     <h2>{{count}} Results Found</h2>
//                       <div class="row">
//                           <div class="column">
//                             <div class="card">
//                               <h3>data[i].address</h3>
//                               <p>Location: location_name</p>
//                               <p>Start at: time_begin</p>
//                               <p>Meeting Type: meeting_type</p>
//                               <p>Special Interest: specialinterest</p>
//                               <p>Accessibility: Yes</p>
//                             </div>
//                           </div>

//                           <div class="column">
//                             <div class="card">
//                               <h3>data[i].address</h3>
//                               <p>Location: location_name</p>
//                               <p>Start at: time_begin</p>
//                               <p>Meeting Type: meeting_type</p>
//                               <p>Special Interest: specialinterest</p>
//                               <p>Accessibility: Yes</p>
//                             </div>
//                           </div>

//                           <div class="column">
//                             <div class="card">
//                               <h3>data[i].address</h3>
//                               <p>Location: location_name</p>
//                               <p>Start at: time_begin</p>
//                               <p>Meeting Type: meeting_type</p>
//                               <p>Special Interest: specialinterest</p>
//                               <p>Accessibility: Yes</p>
//                             </div>
//                           </div>

//                         </div>

//                 </div>
//             </div>
