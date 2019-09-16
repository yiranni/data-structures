# Week 3
The practice for this week focuses on API Request. <br />
API is provided by [Texas A&M GeoServices](http://geoservices.tamu.edu/Services/Geocode/WebService/). <br />
## Goal
The output from [week2](https://github.com/yiranni/data-structures/blob/master/data/m05meetingAddress.txt]) only includes addresses, state, and zipcode. 
<br />
In this practice, I will add more information such as latitude and longitude that corresponds to the address [here](https://github.com/yiranni/data-structures/blob/master/data/m05meetingAddress.txt]) through API request. Add write a new [file](https://github.com/yiranni/data-structures/blob/master/data-structures/data/m05meetingAddress-latlong.txt) with array that contains all the information.<br />
I will use two files in order to limit API requests rate. 
- [apiRequest](https://github.com/yiranni/data-structures/blob/master/data-structures/week3/apiRequest.js) is to request API information and save the output as a JSON file.
- [writeFile](https://github.com/yiranni/data-structures/blob/master/data-structures/week3/writeFile.js) is to combine information from two files and write all the information into a text file.

## API Request
### Read File
I will first read the file that contains all the meeting addresses by
```
var content = fs.readFileSync('/home/ec2-user/environment/data-structures/data/m05meetingAddress.txt');toString().split('\n');
```
Then I will contruct the string stored in the file into an object by doing
```
var addressesData = JSON.parse(content);
```
### Start Geocode Addresses
Create 2 arrays for `meetingsData` and `addresses`. `meetingData` contains all the information requested from the API based on the street address information, while `addresses` only contains street address info.
```
var meetingsData = [];
var addresses =[];
```

### Request More Info From API
With known street addresses stored in `addresses` array, I will request all the information related to these addresses from Texas A$M GeoServices API. And write the requested information into [first.json](https://github.com/yiranni/data-structures/blob/master/data-structures/data/first.json).
```
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
```
## Write Files
This file is to write the most necessary information related to meeting addresses as an array into a text file.
### Read first.json
```
var content = fs.readFileSync('/home/ec2-user/environment/data-structures/data/first.json')
```
[first.json](https://github.com/yiranni/data-structures/blob/master/data-structures/data/first.json) written from apiRequest contains information such as latitude and longitude.
### Read m05meetingAddress.txt
However, first.json misses some information such as zipcodes which are available [here](https://github.com/yiranni/data-structures/blob/master/data-structures/data/m05meetingAddress.txt). (br /)
Therefore, I will also read the text file by doing 
```
var contentWithZip = fs.readFileSync('/home/ec2-user/environment/data-structures/data/m05meetingAddress.txt')
```
### Parse Data
Then I will parse all the JSON string into objects.
```
var data = JSON.parse(content);
var dataWithZip = JSON.parse(contentWithZip);
```
### Create Array for Zipcodes
Write an array with all the zipcode information that is stored in `dataWithZip`.
```
var zipArry = [];
for (var i = 0; i < dataWithZip.length; i++) {
    zipArry.push(dataWithZip[i].zip);
}
```
### Write Information from `first.json` and `m05meetingAddress.txt` Into An Array
```
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
```
### Write The Array Into A File
```
fs.writeFileSync('/home/ec2-user/environment/data-structures/data/m05meetingAddress.txt_latLong', JSON.stringify(addressArry));
```
The final result will be saved [here](https://github.com/yiranni/data-structures/blob/master/data-structures/data/m05meetingAddress-latlong.txt).



