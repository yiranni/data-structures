const { Client } = require('pg');
const pgp = require('pg-promise')();
const db = pgp;
var fs = require("fs");
var async = require('async');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'yiranni';
db_credentials.host = 'aameeting.cowtwtgreshm.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;;
db_credentials.port = 5432;

const allRecords = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data-structures/week7/data/allmeetings.json'));

// const client = new Client(db_credentials);
// client.connect();

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

async function insertMeeting() {
    await async.eachSeries(allRecords, async function(zone, err, callback) {
        
        if (err) {
            console.log("allRecords err:", err)
        }
    
        const zoneId = await getZoneId(zone.zone);
        
        await async.eachSeries(zone.groups, async function(group, err, callback) {
            
            if (err) {
                console.log("group err:", err)
            }
            
            console.log("groupName:", group.group);
            const groupId = await getGroupId(group.group.trim());
            console.log("groupId:", groupId)
            
            const groupLocation = group.locations;
            const groupAddress = group.address;
            const groupCity = group.city;
            const groupState = group.state;
            const groupZip = group.zip;
            const groupAccessibility = group.accessibility;
            const groupLat = group.lat;
            const groupLong = group.lng;
            
            await async.eachSeries(group.allMeetings, async function(mtg, err) {
                
                if (err) {
                    console.log("group mtg:", err)
                }
                
                const groupMeetingType = mtg.meetingType;
                const groupDay = mtg.day;
                const groupBegin = mtg.beginTime;
                const groupEnd = mtg.endTime;
                const groupSpecial = mtg.specialInterest;
                
                const insertArgs = [
                    groupMeetingType,
                    groupId,
                    zoneId,
                    groupLocation,
                    groupAddress,
                    groupZip,
                    groupCity,
                    groupState,
                    groupLat,
                    groupLong,
                    groupAccessibility,
                    groupDay,
                    groupBegin,
                    groupEnd,
                    groupSpecial
                ];
                
                try {
                    const client = new Client(db_credentials);
                    await client.connect();
                    await client.query(insertStatement, insertArgs)
                    await client.end();
                } catch (err) {
                    console.log("insert err:", err)
                }
            })
        });
    });
    process.exit();
}

async function getGroupId(groupName) {
    const client = new Client(db_credentials);
    client.connect();
    
    const nameArg = [groupName];
    let response;
    
    try {
        response = await client.query(getGroupIdStatement, nameArg);
        await client.end();
        console.log(response.rows);
        return response.rows[0].group_id;
    } catch (err) {
        console.log("getGroupId err:", err)
    }
}

async function getZoneId(zoneName) {
    const client = new Client(db_credentials);
    client.connect();
    
    const nameArg = [zoneName];
    let response;
    
    // try catch works
    try {
        response = await client.query(getZoneIdStatement, nameArg)
        await client.end();
        return response.rows[0].zone_id;
    } catch (err) {
        console.log("getZoneId err:", err)
    }
    
    // async doesnt
    // return await client.query(getZoneIdStatement, nameArg, async (err, res) => {
    //     if (err) throw err;
        
    //     // prints out my data
    //     // console.log(res.rows);
    //     // let result = res.rows[0];
    //     await client.end();
        
    //     return res;
    // })
}


// insertMeeting();

// forever Promise { <pending> }

// const main = async () => {
//     const res = await getGroupId("YOUTH ENJOYING SOBRIETY (Y.E.S.)");
//     // const res = await getZoneId(1);
//     console.log("res:", res);
// }


const main = async () => {
    await insertMeeting();
}

main();