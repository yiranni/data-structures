var AWS = require('aws-sdk'); // npm install aws-sdk
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";

var async = require('async'); 
var dynamodb = new AWS.DynamoDB();

var diaryEntries = [];

class DiaryEntry {
  constructor(category, date, entry) {
    this.category = {};
    this.category.S = category;
    this.date = {}; 
    this.date.S = new Date(date).toLocaleString()
    this.entry = {};
    this.entry.S = entry;
  }
}

diaryEntries.push(new DiaryEntry('personal', 'October 22, 1997 17:30:00', "I was born!"));
diaryEntries.push(new DiaryEntry('study', 'September 1, 2004 8:00:00', "This is my first day of elementary school."));
diaryEntries.push(new DiaryEntry('badminton', 'July 1, 2005 08:00:00', "I had my first badminton training."));
diaryEntries.push(new DiaryEntry('badminton', 'September 15, 2009 16:10:00', "I won my first champion in province competition!"));
diaryEntries.push(new DiaryEntry('badminton', 'July 5, 2009 8:00:00', "I started my badminton career in the professional team."));
diaryEntries.push(new DiaryEntry('badminton', 'August 25, 2012 12:10:00', "I left my team for school."));
diaryEntries.push(new DiaryEntry('study', 'September 1, 2012 8:00:00', "My first day of high school. Back to school life, temporarily say bye to badminton :("));
diaryEntries.push(new DiaryEntry('work', 'July 1, 2018 8:10:00', "First day of my first internship!"));
diaryEntries.push(new DiaryEntry('study', 'August 28, 2019 8:10:00', "I started school at Parsons."));

console.log(diaryEntries);

async.eachSeries(diaryEntries, function(value, callback) {
    
    var params = {};
    params.Item = value; 
    params.TableName = "deardiary";
    
    dynamodb.putItem(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
    
    setTimeout(callback, 1000);
}, function() {
    console.log('Done!');
});