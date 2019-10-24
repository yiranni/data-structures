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
var mtgs = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data-structures/week7/data/allDataFromTxt.json'));
async.eachSeries(mtgs, function(ele, callback) {
    var thisZoneGroups = ele.groups;
    var thisZoneAddresses = [];
    for (var i = 0; i < thisZoneGroups.length; i++) {
        thisZoneAddresses.push(thisZoneGroups[i].address)
    }

    var thisZoneGeocodes = []
    
    async.eachSeries(thisZoneAddresses, function(value, callback) {
        var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
        apiRequest += 'streetAddress=' + value.split(' ').join('%20');
        apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey;
        apiRequest += '&format=json&version=4.01';

        request(apiRequest, function(err, resp, body) {
            if (err) { throw err; }
            else {
                var tamuGeo = JSON.parse(body);
                thisZoneGeocodes.push(tamuGeo);
            }
        });
        setTimeout(callback, 2000);
    }, function() {
        fs.writeFileSync('/home/ec2-user/environment/data-structures/week7/data/zone' + ele.zone + 'geocodes.json', JSON.stringify(thisZoneGeocodes));
        console.log('*** *** *** *** ***');
        console.log('Number of meetings in zone' + ele.zone);
        console.log(thisZoneGeocodes.length);
        console.log('************');
    });
    
    setTimeout(callback, 10000)
}); 
