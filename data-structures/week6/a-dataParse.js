// This file is to parse data from text file

var fs = require('fs');
var cheerio = require('cheerio');

// load the thesis text file into a variable, `content`
// this is the file that we created in the starter code from last week
var content = fs.readFileSync('/home/ec2-user/environment/data-structures/data/m05.txt');


// load `content` into a cheerio object
var $ = cheerio.load(content);


// write the addresses to a text file
var meetingData = [];


// find 'td' tag
$('tr').each(function(i, elem) {
    if($(elem).attr('style') === "margin-bottom:10px") {
        var thisMeeting = {};
        var zone = 5;
        thisMeeting.zone = zone;
        thisMeeting.group =  $($(elem).html().split('<br>')[1].trim().split('-')[0]).text().replace(/(['])/g, '');
        var locations;
        if($(elem).html().split('</h4>')[0].trim().split("<h4 style=\"margin:0;padding:0;\">")[1].length > 0) {
            locations =$(elem).html().split('</h4>')[0].trim().split("<h4 style=\"margin:0;padding:0;\">")[1];
        } else {
            locations = "N/A"
        }
        thisMeeting.locations = locations;
        thisMeeting.address = $(elem).html().split('<br>')[2].trim().split(',')[0];
        thisMeeting.city = "New York";
        thisMeeting.state = "NY";
        thisMeeting.zip =   $(elem).html().split('<br>')[3].trim().slice(-5);
        
        var accessibility;
        if($(elem).html().includes('wheelchair')) {
            accessibility = true;
        }else {
            accessibility = false
        }
        thisMeeting.accessibility = accessibility;
        
        var meetingSchedule = $(elem).html().split('<td style="border-bottom:1px solid #e3e3e3;width:350px;" valign="top">')[1].trim().split('</td>')[0];
        var meetingFreqs = (meetingSchedule.match(/From/g) || []).length;
        var allMeetings = [];
        for(var i = 0; i < meetingFreqs; i ++) {
            var thisTime = {};
            var day;
            var beginTime = meetingSchedule.split('From')[i + 1].trim().split('<b>')[0].split('</b>  ')[1];
            var endTime;
            var meetingType;
            var specialInterest;
            
            if(!meetingSchedule.split('From')[i+1].includes('Meeting Type')) {
                meetingType = "N/A";
               
            }else {
                 meetingType = meetingSchedule.split('From')[i + 1].split('Meeting Type</b> ')[1].split(' =')[0];
                
            }
            if(!meetingSchedule.split('From')[i+1].includes('Special Interest')) {
                specialInterest = "N/A"
            }else {
                
                 specialInterest = meetingSchedule.split('From')[i + 1].trim().split('Special Interest</b> ')[1].split('\n')[0];
            }
            if(i==0) {
                day = meetingSchedule.split('From')[i].trim().split('<b>')[1];
                endTime = meetingSchedule.split('to')[1].trim().split('<br')[0].split('</b> ')[1];
                
            }else {
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
        // console.log(allMeetings)

        thisMeeting.allMeetings = allMeetings;
        
        meetingData.push(thisMeeting);
        console.log(meetingData)
        
       
    }
});


fs.writeFileSync('/home/ec2-user/environment/data-structures/week6/data/m05meeting.json', JSON.stringify(meetingData));

