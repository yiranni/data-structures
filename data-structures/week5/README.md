# Week 5 - NoSQL
For this exercise, I will focus on practicing NoSQL database with [DynamoDB service](https://aws.amazon.com/dynamodb/).<br/>
The data I will be using is from [BWF(Badminton World Federation)](https://aws.amazon.com/dynamodb/) and I will create a database table with information related to BWF tournaments.
## Data Overview
BWF records all tournaments on its site and displays data in the following format. <br />
![bwf-events](https://github.com/yiranni/data-structures/blob/master/data-structures/week5/img/bwf-events.png) <br />
It also records winners of each tournament in 5 events (Men's Singles, Women's Singles, Men's Doubles, Women's Doubles, Mixed Doubles). <br />
![winners](https://github.com/yiranni/data-structures/blob/master/data-structures/week5/img/bwf-winners.png) <br />
I will gather information of both tournaments and winners from the site and write it into NoSQL database.

## Process
### Plan
#### Data Model
Based on the reserach on BWF website, I decided to **Normalized Data Model** to ensure the accuracy of tournaments data. <br />
For instance, China Masters in 2017 was recorded as "China Masters 2017" but recorded as "Lingshui China Masters 2018" in China Masters in 2018. <br />
![China Masters 2017](https://github.com/yiranni/data-structures/blob/master/data-structures/week5/img/bwf-chinamaster-2017.png) <br />
![China Masters 2018](https://github.com/yiranni/data-structures/blob/master/data-structures/week5/img/bwf-chinamaster-2018.png) <br />
If I want to find information of all winners in China Masters in all years, it would be difficult and inaccurate to do it with Unnormalized Data Model.

#### Data Structure
**title**: *string*. This stores the tournament name displays on the site. e.g. **Lingshui China Masters 2018** <br />
**tournament**: *string*. This stores the general name. e.g. **Lingshui China Master 2018** will be stored as **China Masters** <br />
**beginDate**: *num* <br /> (Partition Key)
**endDate**: *num* <br />
**beginYear**: *num* <br />
**endYear**: *num* <br />
**beginMonth**: *num* <br />
**endMonth**: *num* <br />
**beginDay**: *num* <br />
**endDay**: *num* <br />
**country**: *string* <br />
**city**: *string* <br />
**grade**: *num* (1-3) <br />
**category**: *string* <br />
**winners**: *array* with multiple strings



### Create Dynamodb Table
![create table](https://github.com/yiranni/data-structures/blob/master/data-structures/week5/img/dynamodb-create.png) <br />

I created a table called `bwftournaments` with **Partition Key** of `tournament` and **Sort Key** of `beginDate`.
### Construct Class for Storing Items
```
class BlogEntry {
  constructor(tournament, beginDate, endDate, country, city, grade, category, winners) {
    this.tournament = {}; // partition key
    this.tournament.S = tournament;
    this.beginDate = {}; // sort key
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
    ...
  }
}
```
The constructor contains items of tournament name, begin and end date, country, city, grade, category, and winners.

### Add Items into Constructor
For this exercise, I only added 3 items into the databse.
```
var blogEntries = [];
blogEntries.push(new BlogEntry('Thailand Masters','January 9 2018', 'January 14 2018', 'Thailand', 'Bangkok', 2, 'BWF World Tour Super 300', ['Tommy SUGIARTO', 'Nitchaon JINDAPOL', 'Tinn ISRIYANET & Kittisak NAMDASH', 'Jongkolphan KITITHARAKUL & Rawinda PRAJONGJAI', 'CHAN Peng Soon & GOH Liu Ying']));
blogEntries.push(new BlogEntry('China Masters','April 10 2018', 'April 15 2018', 'China', 'Ling Shui', 2, 'BWF World Tour Super 100', ['LIN Yu Hsien', 'LI Xue Rui', 'HAN Cheng Kai & ZHOU Hao Dong', 'DU Yue & LI Yin Hui', 'GUO Xin Wa & LIU Xuan Xuan']));
blogEntries.push(new BlogEntry('TOTAL BWF World Championships','June 30 2018', 'August 5 2018', 'China', 'Nanjing', 1, 'World Championships', ['Kento MOMOTA', 'Carolina MARIN', 'LI Jun Hui & LIU Yu Chen', 'Mayu MATSUMOTO & Wakana NAGAHARA', 'ZHENG Si Wei & HUANG Ya Qiong']));
```
### Add Data into DynamoDB Table
With items stored in the constructor, now I could add all items into the database table.
```
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
```


## DynamoDB Output
![output](https://github.com/yiranni/data-structures/blob/master/data-structures/week5/img/output.png) <br />