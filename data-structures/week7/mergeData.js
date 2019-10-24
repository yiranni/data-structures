var fs = require('fs');
var geocodesAllZone = []
for(var i = 0; i < 10; i++) {
    var thisZoneGeocodes = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data-structures/week7/data/zone' + (i + 1) + 'geocodes.json'));
    geocodesAllZone.push(thisZoneGeocodes);
    
}
var addressesAllZone = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data-structures/week7/data/allDataFromTxt.json'))

for(var i = 0; i < addressesAllZone.length; i++) {
    var thisZoneData = addressesAllZone[i]
    var thisZoneGroups = thisZoneData.groups;
    for(var j = 0; j < thisZoneGroups.length; j++) {
        thisZoneGroups[j].lat = geocodesAllZone[i][j].OutputGeocodes[0].OutputGeocode.Latitude;
        thisZoneGroups[j].lng = geocodesAllZone[i][j].OutputGeocodes[0].OutputGeocode.Longitude;
    }
}

for(var i = 0; i < addressesAllZone.length; i++) {
    fs.writeFileSync('/home/ec2-user/environment/data-structures/week7/data/zone' + (i + 1) + 'Data.json', JSON.stringify(addressesAllZone[i]));
}

fs.writeFileSync('/home/ec2-user/environment/data-structures/week7/data/allmeetings.json', JSON.stringify(addressesAllZone));