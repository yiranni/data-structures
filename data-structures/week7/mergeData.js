var fs = require('fs');
var geocodesAllZone = []
for(var i = 0; i < 10; i++) {
    var thisZoneGeocodes = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data-structures/week7/data/zone' + (i + 1) + 'geocodes.json'));
    geocodesAllZone.push(thisZoneGeocodes);
    
}
var addressesAllZone = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data-structures/week7/data/allDataFromTxt.json'))
/*
// format for lat lng e.g. zone1 group1
// console.log(geocodesAllZone[0][0].OutputGeocodes[0].OutputGeocode.Latitude)

var zone1 = addressesAllZone[0];
// console.log(zone1.groups[0])
zone1.groups[0].lat = geocodesAllZone[0][0].OutputGeocodes[0].OutputGeocode.Latitude
// console.log()
console.log(zone1.groups[0])
*/

// addressesAllZone.forEach(function(ele) {
//     // console.log(ele.zone)
//     var thisZoneGroups = ele.groups;
//     thisZoneGroups.forEach(function(group) {
//         group.lat
//     })
// })
for(var i = 0; i < addressesAllZone.length; i++) {
    var thisZoneData = addressesAllZone[i]
    // console.log(thisZoneData.zone)
    var thisZoneGroups = thisZoneData.groups;
    for(var j = 0; j < thisZoneGroups.length; j++) {
        thisZoneGroups[j].lat = geocodesAllZone[i][j].OutputGeocodes[0].OutputGeocode.Latitude;
        thisZoneGroups[j].lng = geocodesAllZone[i][j].OutputGeocodes[0].OutputGeocode.Longitude;
    }
}

for(var i = 0; i < addressesAllZone.length; i++) {
    fs.writeFileSync('/home/ec2-user/environment/data-structures/week7/data/zone' + (i + 1) + 'Data.json', JSON.stringify(addressesAllZone[i]));
}