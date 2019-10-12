// npm install cheerio

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
$('td').each(function(i, elem) {
    if($(elem).attr('style') === "border-bottom:1px solid #e3e3e3; width:260px") {
        var thisMeeting = {};
        thisMeeting.streetAddress = $(elem).html().split('<br>')[2].trim().split(',')[0];
        thisMeeting.city = "New York";
        thisMeeting.state = "NY";
        thisMeeting.zip =   $(elem).html().split('<br>')[3].trim().slice(-5);
        var details = $($(elem).html().split('<br>')[5].trim().split('<span')[0]).text().trim();
        thisMeeting.details = details;
        // console.log(details)
        var accessibility;
        if($(elem).html().includes('wheelchair')) {
            accessibility = true;
        }else {
            accessibility = false
        }
        thisMeeting.accessibility = accessibility;
        meetingData.push(thisMeeting);
       
    }
});

console.log(meetingData);
// console.log(meetingData.length);


// fs.writeFileSync('/home/ec2-user/environment/data-structures/data/m05meetingAddress.txt', JSON.stringify(meetingData));

