# Week 4 
With the [previous data](https://github.com/yiranni/data-structures/blob/master/data-structures/week4/data/AA-data-m05.json) parsed from [New York Intergroup Meeting Data in zone 5](https://parsons.nyc/aa/m05.html)
and [Texas A&M GeoServices](http://geoservices.tamu.edu/Services/Geocode/WebService/) API, I will focus on writing the data to a relational database.

## Create Table
[wa04a.js](https://github.com/yiranni/data-structures/blob/master/data-structures/week4/wa04a.js) is for creating a table for AA locations. <br />
I will include fields of `address`, `city`, `state`, `zipcode`, `latitude` and `longitude` in this table.

```
var thisQuery = "CREATE TABLE aalocations (address varchar(100),\
                                          city varchar(100),\
                                          state varchar(100),\
                                          zip varchar(5),\
                                          lat double precision,\
                                          long double precision);";
```

## Populate Database
[wa04b.js](https://github.com/yiranni/data-structures/blob/master/data-structures/week4/wa04b.js) is for populating data that is previously parsed and saved [here](https://github.com/yiranni/data-structures/blob/master/data-structures/week4/data/AA-data-m05.json) <br />
With the data populated, I will insert values into corresponded field.
```
async.eachSeries(allAddresses, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO aalocations VALUES ('" + value.address + "', " + "'" + value.city + "', " +  "'" + value.state + "', " + value.zip  + ", " + value.latitude + ", " + value.longitude + ");";
    console.log(thisQuery)
    console.log('done');
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 
```
## Check Work
[wa04c.js](https://github.com/yiranni/data-structures/blob/master/data-structures/week4/wa04c.js) is for checking the final output by 

```
SELECT * FROM aalocations
```
I will append each row of data into [AA05db.json](https://github.com/yiranni/data-structures/blob/master/data-structures/week4/data/AA05db.json).

## Final Output
[View this](https://github.com/yiranni/data-structures/blob/master/data-structures/week4/data/AA05db.json)

## Future Work
![database schema](https://github.com/yiranni/data-structures/blob/master/data-structures/week4/aameetingsdb.png)
I will add three more tables into the database, including `aazones`, `aagroups` and `aameeteings`.
