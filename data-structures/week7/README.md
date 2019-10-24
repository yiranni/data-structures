# Week 7
Based on previous process of creating PostgreSQL for [AA Meeting in zone 5](https://parsons.nyc/aa/m05.html), I will parse data from all 10 zones and create PostgreSQL for all meetings in all zones.
## Planning
I decided to create **3** tables, including zone, group, and meeting. <br />
![schema](https://github.com/yiranni/data-structures/tree/master/data-structures/week7/img/RDS.png)

## Data Parse
In Week 1, I downloaded HTML files of each meeting zone and stored these files [here](https://github.com/yiranni/data-structures/tree/master/data-structures/data). In order to dynamically find relevant information in each zone, I first add html text files into an array.
``` ruby
var file = [];
for (var i = 1; i < 11; i++) {
    if (i < 10) {
        file.push('/home/ec2-user/environment/data-structures/data/m0' + i + '.txt')
    }
    else {
        file.push('/home/ec2-user/environment/data-structures/data/m' + i + '.txt')
    }
}
```
I initiated another array called `meetings` and planned to format the array in the following style: 
``` ruby
[{zone: 1, groups: [{group: , 
                    address: , 
                    ... , 
                    allMeetings: [{day: , time: , ...},
                                 {day: , time: , ...},
                                 {day: , time: , ...}]
                    },
                    {group: , 
                    address: , 
                    ... , 
                    allMeetings: [{day: , time: , ...},
                                 {day: , time: , ...},
                                 {day: , time: , ...}]
                    }]
    
},
{zone: 2, groups: [{group: , 
                    address: , 
                    ... , 
                    allMeetings: [{day: , time: , ...},
                                 {day: , time: , ...},
                                 {day: , time: , ...}]
                    },
                    {group: , 
                    address: , 
                    ... , 
                    allMeetings: [{day: , time: , ...},
                                 {day: , time: , ...},
                                 {day: , time: , ...}]
                    }]
    
},
...
]
```

## API Request
With address, city, and  state parsed in the step above, I requested information of latitude and longitude of each location from [TAMU GeoServices](https://geoservices.tamu.edu/default.aspx). <br />

I decided to read addresses in each zone, and save geocodes information of each zone in different files. By doing this, it will be easier for the further step of combining data from html files and API data.
``` ruby
var mtgs = JSON.parse(fs.readFileSync('allDataFromTxt.json'));
async.eachSeries(mtgs, function(ele, callback) {
    var thisZoneGroups = ele.groups;
    var thisZoneAddresses = [];
    for (var i = 0; i < thisZoneGroups.length; i++) {
        thisZoneAddresses.push(thisZoneGroups[i].address)
    }

    var thisZoneGeocodes = []
    
    async.eachSeries(thisZoneAddresses, function(value, callback) {
        var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
        apiRequest += 'streetAddress=' + value.split(' ').join('%20');
        apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey;
        apiRequest += '&format=json&version=4.01';

        request(apiRequest, function(err, resp, body) {
            if (err) { throw err; }
            else {
                var tamuGeo = JSON.parse(body);
                thisZoneGeocodes.push(tamuGeo);
            }
        });
        setTimeout(callback, 2000);
    }, function() {
        fs.writeFileSync('data/zone' + ele.zone + 'geocodes.json', JSON.stringify(thisZoneGeocodes));
        console.log('*** *** *** *** ***');
        console.log('Number of meetings in zone' + ele.zone);
        console.log(thisZoneGeocodes.length);
        console.log('************');
    });
    
    setTimeout(callback, 10000)
}); 
```

## Combine Data 
Add data requested from TAMU GeoServices API into each `group` named as `lat` and `lng`.<br />
A sample output data of 1 group is presented as following:
``` ruby
{"group":"A DESIGN FOR LIVING ",
"locations":"St Andrews Church",
"address":"20 Cardinal Hayes Place",
"city":"New York",
"state":"NY","zip":"10007",
"accessibility":false,
"allMeetings":[
                {"day":"Thursdays",
                "beginTime":"7:00 AM ",
                "endTime":"8:00 AM ",
                "meetingType":"OD",
                "specialInterest":"N/A"},
                {"day":"Tuesdays",
                "beginTime":"7:00 AM ",
                "endTime":"8:00 AM",
                "meetingType":"B",
                "specialInterest":"N/A"}
               ],
"lat":"40.7132514",
"lng":"-74.002398"
}
```

## PostgreSQL 
### Create Tables
Based on the schema created in **Planning**, I created postgreSQL tables as following:
``` ruby
var query = ""

query += "CREATE TABLE groups (\
                              group_id serial PRIMARY KEY,\
                              group_name varchar(200)\
                              );"
query += "CREATE TABLE zone (\
                              zone_id serial PRIMARY KEY,\
                              zone_name integer\
                              );"
query += "CREATE TABLE meeting (\
                              meeting_id serial PRIMARY KEY,\
                              meeting_type varchar(10),\
                              group_id integer REFERENCES groups (group_id),\
                              zone_id integer REFERENCES zone (zone_id),\
                              location_name varchar,\
                              address varchar,\
                              zip varchar(10),\
                              city varchar(100),\
                              state varchar(10),\
                              lat double precision,\
                              lng double precision,\
                              accessibility bool,\
                              day varchar(100),\
                              time_begin varchar(200),\
                              time_end varchar(200),\
                              specialInterest varchar(100)\
                              );"
```
### Insert Data
#### ZONE
Inserting zone data is relatively easy, because zone_name are stored in the most outer layer of the JSON file.
``` ruby
async.eachSeries(allmtgs, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO zone (zone_id, zone_name) VALUES (DEFAULT, " + value.zone + ")";
    setTimeout(callback, 2000);
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });

});
```
![zone](https://github.com/yiranni/data-structures/tree/master/data-structures/week7/img/tableZone.png)


#### GROUP
Each group name are stored within all groups in the same zone.<br />
At this point, it is unknown if a group would be existed in two or more zones. Therefore, I created a Set to store each unique group.
``` ruby
async function collectGroups() {
    // gets outer layer object
    await async.eachSeries(allmtgs, function(meeting, callback) {
        // gets inner layer object
        async.eachSeries(meeting.groups, function(groups, callback) {
            setTimeout(callback, 50);
            // extracts group name and add to set
            uniqueGroups.add(groups.group.trim());
            console.log("read from source: " + groups.group);
        });
        setTimeout(callback, 5000);
    });

    // returns the entire set
    return uniqueGroups;
}

```
Due to the inconsistent data from html files, e.g. spacing, escapes, etc. I decided to apply prepared statements to avoid insert errors.
``` ruby
async function execute() {
    let uniqueGroups = await collectGroups();
    const client = new Client(db_credentials);
    const insertStatement = "INSERT INTO groups(group_name) VALUES($1)"
    client.connect();

    uniqueGroups.forEach(function(group) {
        console.log("adding group " + group);
        let groupArg = [group];
        client.query(insertStatement, groupArg, (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log(res.rows[0])
            }
        })
    });

}

execute();
```
![group](https://github.com/yiranni/data-structures/tree/master/data-structures/week7/img/tableGroup.png)

#### MEETING
Inserting meetings is the most complicated because meeting data is stored in the most inner layer, it is also required to combine data in this layer and outside. <br />
Besides, based on schema planned before, I also need to refer to two foreign keys to connect three tables. <Br />
I first initiated 3 prepared statements for inserting group information and two foreign keys to avoid potential syntax errors.
``` ruby
const insertStatement = "insert into meeting(meeting_type, \
    group_id, \
    zone_id, \
    location_name, \
    address, \
    zip, \
    city, \
    state, \
    lat, \
    lng, \
    accessibility, \
    day, \
    time_begin, \
    time_end, \
    specialInterest) \
    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)";
const getGroupIdStatement = "select group_id from groups where group_name = $1";
const getZoneIdStatement = "select zone_id from zone where zone_name = $1";
```

The following step is to get group/zone ID from a different table.
``` ruby
async function getZone/GroupId(zoneName) {
    const client = new Client(db_credentials);
    client.connect();
    
    const nameArg = [zone/groupName];
    let response;
    
    try {
        response = await client.query(getZone/GroupIdStatement, nameArg)
        await client.end();
        return response.rows[0].zone_id;
    } catch (err) {
        console.log("getZone/GroupId err:", err)
    }
    
}

```

![meeting](https://github.com/yiranni/data-structures/tree/master/data-structures/week7/img/tableMeeting.png)



    