var fs = require('fs');
var cheerio = require('cheerio');

// add all meeting txt files to file array
var file = [];
for (var i = 1; i < 11; i++) {
    if (i < 10) {
        file.push('/home/ec2-user/environment/data-structures/data/m0' + i + '.txt')
    }
    else {
        file.push('/home/ec2-user/environment/data-structures/data/m' + i + '.txt')
    }
}

// start output array `meetings`
var meetings = [];
// add info into array
file.forEach(function(ele) {
    // structure: [{zone: 1, groups:[]}, {zone: 2, groups:[]}, ... {zone: 10, groups:[]}]
    // zone
    var thisZone = {};
    var zone;
    if (Number(ele.charAt(ele.indexOf('.') - 1)) > 0) {
        zone = Number(ele.charAt(ele.indexOf('.') - 1));
    }
    else {
        zone = Number(ele.charAt(ele.indexOf('.') - 2) + ele.charAt(ele.indexOf('.') - 1))
    }
    thisZone.zone = zone;
    // groups
    var groups = [];
    const content = fs.readFileSync(ele)
    var $ = cheerio.load(content)
    // find 'tr' tags
    $('tr').each(function(i, elem) {
        if ($(elem).attr('style') === "margin-bottom:10px") {
            // groups[] are consisted with multiple `thisMeeting`
            var thisMeeting = {};
            // thisMeeting{group: , locations: , address: , city: , state: , zip: , accessbility: , allMeetings: []}
            thisMeeting.group = $($(elem).html().split('<br>')[1].trim().split('-')[0]).text().replace(/(['])/g, '');
            var locations;
            if ($(elem).html().split('</h4>')[0].trim().split("<h4 style=\"margin:0;padding:0;\">")[1].length > 0) {
                locations = $(elem).html().split('</h4>')[0].trim().split("<h4 style=\"margin:0;padding:0;\">")[1];
            }
            else {
                locations = "N/A"
            }
            thisMeeting.locations = locations;
            thisMeeting.address = $(elem).html().split('<br>')[2].trim().split(',')[0];
            thisMeeting.city = "New York";
            thisMeeting.state = "NY";
            var zip = $(elem).html().split('<br>')[3].trim().slice(-5);
            if(zip.charAt(0) == '1') {
                thisMeeting.zip = zip;
            }else {
                thisMeeting.zip = 'N/A';
            }
            // console.log(thisMeeting.zip)
            // thisMeeting.zip = zip;

            var accessibility;
            if ($(elem).html().includes('wheelchair')) {
                accessibility = true;
            }
            else {
                accessibility = false
            }
            thisMeeting.accessibility = accessibility;

            var meetingSchedule = $(elem).html().split('<td style="border-bottom:1px solid #e3e3e3;width:350px;" valign="top">')[1].trim().split('</td>')[0];
            var meetingFreqs = (meetingSchedule.match(/From/g) || []).length;
            // construct allMeetings[{day: , beginTime: , endTime: , meetingType: , specialInterests: }]
            var allMeetings = [];
            for (var i = 0; i < meetingFreqs; i++) {
                var thisTime = {};
                var day;
                var beginTime = meetingSchedule.split('From')[i + 1].trim().split('<b>')[0].split('</b>  ')[1];
                var endTime;
                var meetingType;
                var specialInterest;

                if (!meetingSchedule.split('From')[i + 1].includes('Meeting Type')) {
                    meetingType = "N/A";

                }
                else {
                    meetingType = meetingSchedule.split('From')[i + 1].split('Meeting Type</b> ')[1].split(' =')[0];

                }
                if (!meetingSchedule.split('From')[i + 1].includes('Special Interest')) {
                    specialInterest = "N/A"
                }
                else {

                    specialInterest = meetingSchedule.split('From')[i + 1].trim().split('Special Interest</b> ')[1].split('\n')[0];
                }
                if (i == 0) {
                    day = meetingSchedule.split('From')[i].trim().split('<b>')[1];
                    endTime = meetingSchedule.split('to')[1].trim().split('<br')[0].split('</b> ')[1];

                }
                else {
                    day = meetingSchedule.split('From')[i].trim().split('<b>').pop();
                    endTime = meetingSchedule.split('to')[i + 1].trim().split('<br />')[0].split(' <br>')[0].split('</b> ')[1];

                }
                thisTime.day = day;
                thisTime.beginTime = beginTime;
                thisTime.endTime = endTime;
                thisTime.meetingType = meetingType;
                thisTime.specialInterest = specialInterest;
                allMeetings.push(thisTime)

            }

            thisMeeting.allMeetings = allMeetings;
            // add thisMeeting into groups
            groups.push(thisMeeting);
            thisZone.groups = groups;
        }
    });
    // add thisZone into meetings
    meetings.push(thisZone)
})


fs.writeFileSync('/home/ec2-user/environment/data-structures//week7/data/allDataFromTxt.json', JSON.stringify(meetings))
