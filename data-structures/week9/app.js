const request = require('request');
const { Client } = require('pg');

// PARTICLE PHOTON
const baseUrl = "https://api.particle.io/v1/devices";
const deviceID = process.env.DEVICE_ID;
const name = "tempsensor";
const accessToken = process.env.ACCESS_TOKEN;
const fullUrl = `${baseUrl}/${deviceID}/${name}?access_token=${accessToken}`;

let db_credentials = new Object();
db_credentials.user = 'yiranni';
db_credentials.host = process.env.DB_HOST;
db_credentials.database = 'tempsensor';
db_credentials.password = process.env.DB_PASS;
db_credentials.port = 5432;

const getAndWriteData = async () => {

    request(fullUrl, async (err, resp, body) => {
        
        if (err) {
            console.log("cannot resquest data:", err);
        }
        
        let cmd;
        let name;
        let temp;
        let timeStamp;
        
        try {
            const result = await JSON.parse(body);
            cmd = result.cmd;
            name = result.name;
            temp = result.result;
            timeStamp = result.coreInfo.last_heard;
            console.log(`new data logged at ${timeStamp}, temp is ${temp}`);
        } catch (e) {
            console.log("cannot parse data:", e);
        }
        
        const client = new Client(db_credentials);
        client.connect();

        const q = "insert into sensordata(cmd, name, result, sensortime) values ($1, $2, $3, $4);";
        const args = [cmd, name, temp, timeStamp];
        
        // cannot await; maybe wrapped with a promise
        client.query(q, args, (err, res) => {
            if (err) {
                console.log("db err:", err);
            } else {
                console.log("db res:", res);
            }
        });
        
        // cannot await therefore cannot close
        // await client.end();
    });
};

// get data every 30 minutes
setInterval(getAndWriteData, 1800000);
// setInterval(getAndWriteData, 5000);
