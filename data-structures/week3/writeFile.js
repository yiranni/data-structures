var request = require('request'); 
var fs = require('fs');

// read json data written based on API request
var content = fs.readFileSync('/home/ec2-user/environment/data-structures/data/first.json');
// read text file with zipcodes info
var contentWithZip = fs.readFileSync('/home/ec2-user/environment/data-structures/data/m05meetingAddress.txt');
var data = JSON.parse(content);
var dataWithZip = JSON.parse(contentWithZip);

// array with zipcodes
var zipArry = [];
for (var i = 0; i < dataWithZip.length; i++) {
    zipArry.push(dataWithZip[i].zip);
}

//  array with street, city, state, zipcode, lat, long
// read data from both json and text
var addressArry = [];
for(var i = 0; i < data.length; i++) {
    var thisAddress = {};
    var streetInfo = data[i].InputAddress.StreetAddress.trim();
    var cityInfo = data[i].InputAddress.City.trim();
    var stateInfo = data[i].InputAddress.State.trim();
    thisAddress.address = streetInfo.substring(0, streetInfo.length - 12);
    thisAddress.city = cityInfo;
    thisAddress.state = stateInfo;
    thisAddress.zip = zipArry[i];
    thisAddress.latitude = data[i].OutputGeocodes[0].OutputGeocode.Latitude;
    thisAddress.longitude = data[i].OutputGeocodes[0].OutputGeocode.Longitude;
    addressArry.push(thisAddress);
    
}


// write data(array) to a text file
fs.writeFileSync('/home/ec2-user/environment/data-structures/data/m05meetingAddress-latlong.json', JSON.stringify(addressArry));
