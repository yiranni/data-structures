// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

// load the thesis text file into a variable, `content`
// this is the file that we created in the starter code from last week
var content = fs.readFileSync('/home/ec2-user/environment/data-structures/data/m05.txt');


// load `content` into a cheerio object
var $ = cheerio.load(content);

// write the project titles to a text file
var m05Titles = ''; // this variable will hold the lines of text

$('h4').each(function(i, elem) {
    m05Titles += ($(elem).text()).trim() + '\n';
});

fs.writeFileSync('/home/ec2-user/environment/data-structures/data/m05Titles.txt', m05Titles);

// var strings = thisHTML.split('<br />');

// for (var i = 0; i<strings.length; i++) {
//     if(i === 2) {
//         console.log(strings[i]);
//         console.log('******');
//     }
// }  