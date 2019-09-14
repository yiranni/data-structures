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
        // m05meetingAddress += ($(elem).text()).trim() + '\n' + '\n';
        // console.log($(elem).html().split('<br>')[2].trim().split(',')[0]);
        var thisMeeting = {};
        thisMeeting.streetAddress = $(elem).html().split('<br>')[2].trim().split(',')[0];
        thisMeeting.city = "New York";
        thisMeeting.state = "NY";
        thisMeeting.zip =   $(elem).html().split('<br>')[3].trim().slice(-5);
        console.log(thisMeeting.zip);
        meetingData.push(thisMeeting);
    }
});

// console.log(meetingData[0].streetAddress);
// console.log(meetingData.length);


fs.writeFileSync('/home/ec2-user/environment/data-structures/data/m05meetingAddress.txt', JSON.stringify(meetingData));

