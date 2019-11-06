# Week 9 Write Data From Temperature Sensor 
In this exercise, I will focus on collecting temperature data by using temperature sensor and [Particle](https://www.particle.io/) Photon. With data collected, I will write data into ProgreSQL table.

## 1. CREATE TABLE
Similar to previous exercise, I first created a ProgreSQL data called `sensorData`.

```ruby
const query = "CREATE TABLE sensorData (\
                _id serial PRIMARY KEY,\
                cmd varchar(100),\
                name varchar(100),\
                result double precision,\
                sensorTime timestamp DEFAULT current_timestamp\
                );"
```

## INSERT DATA
With table created, I requested relevant data from Particle API. <br />
A sample API URL is provided following: <br />
https://api.particle.io/v1/devices/0123456789abcdef/analogvalue?access_token=123412341234

In each API URL, data is formated in the following pattern: <br />
```ruby
{"cmd":"VarReturn",
"name":"name of the device",
"result":18.9375,
"coreInfo":{"last_app":"",
            "last_heard":"2019-11-02T03:56:38.343Z",
            "connected":true,
            "last_handshake_at":"2019-11-01T01:29:53.383Z",
            "deviceID":"123456789",
            "product_id":6}}
```
To get the JSON file of each API URL, I parsed data into `result`
```ruby
const result = await JSON.parse(body);
```
Then, I created variables for each relevant data
```
cmd = result.cmd;
name = result.name;
temp = result.result;
timeStamp = result.coreInfo.last_heard;
```
Then, I inserted each group of data with a prepared statements to avoid syntax errors.
```ruby
const q = "insert into sensordata(cmd, name, result, sensortime) \
        values ($1, $2, $3, $4);";
```


## CONSTANTLY READ DATA
In order to constantly get data from API and run scripts in the background, I used [PM2 Runtime](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/) by
`npm i pm2 -g`
and  initializee a configuration file with:
`pm2 init`

I will be collecting data from the sensor in every 5 minutes, so I set a time interval with
```ruby
setInterval(getAndWriteData, 30000);
```

## SAMPLE RESULTS
```
select * from sensorData;
```

| _id |    cmd    |    name    | result  |       sensortime  
|---|---|---|---|---|
|   1 | VarReturn | tempsensor | 18.9375 | 2019-11-02 03:26:33.863
|   2 | VarReturn | tempsensor | 18.9375 | 2019-11-02 03:56:33.926
