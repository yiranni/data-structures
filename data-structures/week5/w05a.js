// AWS setup
var AWS = require('aws-sdk');
var async = require('async');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

// construct class for blog entry
var blogEntries = [];

class BlogEntry {
  constructor(title, tournament, beginDate, endDate, country, city, grade, category, winners) {
    this.title = {};
    this.title.S = title;
    this.tournament = {}; //sort key
    this.tournament.S = tournament;
    this.beginDate = {}; // partition key
    this.beginDate.S = new Date(beginDate).toDateString();
    this.endDate = {};
    this.endDate.S = new Date(endDate).toDateString();
    this.beginYear = {}; 
    this.beginYear.N = (new Date(beginDate).getYear() + 1900).toString() ;
    this.endYear = {};
    this.endYear.N = (new Date(endDate).getYear() + 1900).toString() ;
    this.beginMonth = {};
    this.beginMonth.N = (new Date(beginDate).getMonth() + 1).toString();
    this.endMonth = {};
    this.endMonth.N = (new Date(endDate).getMonth() + 1).toString();
    this.beginDay = {};
    this.beginDay.N = new Date(beginDate).getDate().toString();
    this.endDay = {};
    this.endDay.S = new Date(endDate).getDate().toString();
    this.country = {};
    this.country.S = country;
    this.city = {};
    this.city.S = city;
    this.grade = {};
    this.grade.N = grade.toString();;
    this.category = {};
    this.category.S = category;
    this.winners = {};
    this.winners.SS = winners; // menSingle, womenSingle, menDouble, womenDouble, mixedDouble
  }
}

// push data into blogEntries
blogEntries.push(new BlogEntry('PRINCESS SIRIVANNAVARI Thailand Masters 2018', 'Thailand Masters','January 9 2018', 'January 14 2018', 'Thailand', 'Bangkok', 2, 'BWF World Tour Super 300', ['Tommy SUGIARTO', 'Nitchaon JINDAPOL', 'Tinn ISRIYANET & Kittisak NAMDASH', 'Jongkolphan KITITHARAKUL & Rawinda PRAJONGJAI', 'CHAN Peng Soon & GOH Liu Ying']));
blogEntries.push(new BlogEntry('Lingshui China Masters 2018', 'China Masters','April 10 2018', 'April 15 2018', 'China', 'Ling Shui', 2, 'BWF World Tour Super 100', ['LIN Yu Hsien', 'LI Xue Rui', 'HAN Cheng Kai & ZHOU Hao Dong', 'DU Yue & LI Yin Hui', 'GUO Xin Wa & LIU Xuan Xuan']));
blogEntries.push(new BlogEntry('TOTAL BWF World Championships 2018', 'World Championships','June 30 2018', 'August 5 2018', 'China', 'Nanjing', 1, 'World Championships', ['Kento MOMOTA', 'Carolina MARIN', 'LI Jun Hui & LIU Yu Chen', 'Mayu MATSUMOTO & Wakana NAGAHARA', 'ZHENG Si Wei & HUANG Ya Qiong']));


// add data into DynamoDB
var params = {};
var i;
for (i = 0; i < blogEntries.length; i++) {
  params.Item += blogEntries[i];
}
params.TableName = "bwftournaments";

async.eachSeries(blogEntries, function(day, callback) {
  params.Item = day;
  dynamodb.putItem(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
  });
  setTimeout(callback, 2000);
});