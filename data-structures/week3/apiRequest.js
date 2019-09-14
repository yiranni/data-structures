// dependencies
var request = require('request'); 
var async = require('async');
const dotenv = require('dotenv');
// TAMU api key
dotenv.config();

const apiKey = process.env.TAMU_KEY;
console.log(apiKey);

var fs = require('fs');

// read file
var content = fs.readFileSync('/home/ec2-user/environment/data-structures/data/m05meetingAddress.txt');toString().split('\n');
var addressesData = JSON.parse(content);

// start geocode addresses
var meetingsData = [];
var addresses =[];

// add data from text file into addresses array
for(var i = 0; i < addressesData.length; i++) {
    addresses.push(addressesData[i].streetAddress);
}

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(value, callback) {
    var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
    apiRequest += 'streetAddress=' + value.split(' ').join('%20');
    apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey;
    apiRequest += '&format=json&version=4.01';

    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        else {
            var tamuGeo = JSON.parse(body);
            meetingsData.push(tamuGeo);
        }
    });
    setTimeout(callback, 2000);
}, function() {
    fs.writeFileSync('/home/ec2-user/environment/data-structures/data/first.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log('Number of meetings in this zone: ');
    console.log(meetingsData.length);
    console.log('************');
    for(var i = 0; i < meetingsData.length; i++) {
    console.log(meetingsData[i].InputAddress);
    }
});