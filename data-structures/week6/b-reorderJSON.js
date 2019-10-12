// this file is to reorder m05meeting.json based on each meeting time
const fs = require("fs")
var m05 = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data-structures/week6/data/m05meeting.json'));
var latlng = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data-structures/data/m05meetingAddress.json'))
var output = []

for(var i = 0; i < m05.length; i++) {
    var thisGroup = m05[i];
    for(var j = 0; j < m05[i].allMeetings.length; j++) {
        var thisMeeting = {};
        thisMeeting.zone = m05[i].zone;
        thisMeeting.group = m05[i].group;
        thisMeeting.locations = m05[i].locations;
        thisMeeting.address = m05[i].address;
        thisMeeting.latitude = latlng[i].latitude;
        thisMeeting.longitude = latlng[i].longitude;
        thisMeeting.accessibility = m05[i].accessibility; 
        thisMeeting.day = thisGroup.allMeetings[j].day;
        thisMeeting.beginTime = thisGroup.allMeetings[j].beginTime;
        thisMeeting.endTime = thisGroup.allMeetings[j].endTime;
        thisMeeting.meetingType = thisGroup.allMeetings[j].meetingType;
        thisMeeting.specialInterest = thisGroup.allMeetings[j].specialInterest;

        output.push(thisMeeting)
    }
}

console.log(output.length)

fs.writeFileSync('/home/ec2-user/environment/data-structures/week6/data/m05.json', JSON.stringify(output));