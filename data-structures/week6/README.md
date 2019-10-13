# Week 6
## AA Meeting - zone 5
### Data Parsing
Different from the data output I previously parsed in [week 4](https://github.com/yiranni/data-structures/blob/master/data-structures/week4/data/AA-data-m05.json), I added more data into the [JSON file]() with extra information of **Group Name**, **Meeting Location**, **Meeting Days**, **Meeting Start Time**, **Meeting End Time**, **Meeting Type**, and **Special Interests**.
<br />
[see output here](https://github.com/yiranni/data-structures/blob/master/data-structures/week6/data/m05meeting.json)
### Reorder JSON output
The meeting data parsed in [Data Parsing](https://github.com/yiranni/data-structures/blob/master/data-structures/week6/data/m05meeting.json) is 28 datasets based on meeting address. In thie file, I reordered data based on each **meeting**. The output is consisted of 138 datasets.
[see output here](https://github.com/yiranni/data-structures/blob/master/data-structures/week6/data/m05.json)

### Create PostgreSQL Table
In order to store all data of AA Meeting in zone 5, I created a PostgreSQL Table `meeting` with following information
```ruby
var query = ""
query += "CREATE TABLE meeting (\
                                id serial PRIMARY KEY,\
                                zone SMALLINT,\
                                groups VARCHAR(200),\
                                address VARCHAR(200),\
                                locations VARCHAR(200),\
                                latitude DOUBLE precision,\
                                longitude DOUBLE precision,\
                                accessibility BOOLEAN,\
                                day VARCHAR(10),\
                                beginTime VARCHAR(20),\
                                endTime VARCHAR(20),\
                                meetingType VARCHAR(10),\
                                specialInterest VARCHAR(100));"
```

### Insert Values Into Table
With the PostgreSQL table created in the previous process, I added data from [m05.json](https://github.com/yiranni/data-structures/blob/master/data-structures/week6/data/m05.json) into the table by

```ruby
 var thisQuery = "INSERT INTO meeting VALUES (DEFAULT, '" + value.zone + "', '" + value.group + "', '" + value.address + "', '"+ value.locations + "', '" + value.latitude + "', '" + value.longitude + "', '" + value.accessibility + "', '"+value.day + "', '" + value.beginTime + "', '" + value.endTime + "', '" + value.meetingType + "', '" + value.specialInterest + "');";
```

### Check Table
To check the PostgreSQL table, I checked the result by selecting all meetings on Mondays with the meeting type of C.
```ruby
SELECT day, beginTime, endTime, locations, address, meetingType FROM meeting WHERE day = 'Mondays' and meetingType = 'C';
```
![postgresql sample output](https://github.com/yiranni/data-structures/blob/master/data-structures/week6/img/aameeting05.png)


## Dear Diary
### Creat NoSQL Table
Created a NoSQL table with 3 values: **category** which defines what type of diary this is, **date** which is the  written date, and **entry** which writes down details of the diary.
```ruby
  class DiaryEntry {
  constructor(category, date, entry) {
    this.category = {};
    this.category.S = category;
    this.date = {}; 
    this.date.S = new Date(date).toISOString()
    this.entry = {};
    this.entry.S = entry;
  }
}
```

### Query Table
With the NoSQL table previously created, I queried the data of all diaries related to `badminton` in `2019`.
```ruby
    var params = {
    TableName : "deardiary",
    KeyConditionExpression: "#tp = :categoryName",// the query expression
    ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
        "#tp" : "category"
    },
    ExpressionAttributeValues: { // the query values
        ":categoryName": {S: "badminton"},
        ":minDate": {S: new Date("January 1, 2019").toISOString()},
        ":maxDate": {S: new Date("December 31, 2019").toISOString()}
    }
};
```
![deardiary output](https://github.com/yiranni/data-structures/blob/master/data-structures/week6/img/deardiaryoutput.png)