// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

// load the thesis text file into a variable, `content`
// this is the file that we created in the starter code from last week
var content = fs.readFileSync('/home/ec2-user/environment/data-structures/data/m05.txt');


// load `content` into a cheerio object
var $ = cheerio.load(content);


// write the addresses to a text file
var m05meetingAddress = ''; // this variable will hold the lines of text

// find 'td' tag
$('td').each(function(i, elem) {
    // remove spacings for address
    if($(elem).attr('style') === "border-bottom:1px solid #e3e3e3; width:260px") {
        m05meetingAddress += ($(elem).text()).trim() + '\n' + '\n';
    };
    // remove elements in 'span' tag ands ' .detailsBox' classes
    
    $('span').remove();
    $(' .detailsBox').remove();
});

// remove extra spaces in text file and write the text file to '/home/ec2-user/environment/data-structures/data/m05meetingAddress.txt'
m05meetingAddress = m05meetingAddress.replace(/\t/g,'');
fs.writeFileSync('/home/ec2-user/environment/data-structures/data/m05meetingAddress.txt', m05meetingAddress);

