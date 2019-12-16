import * as express from 'express';
import * as pg from 'pg';
import AWS from 'aws-sdk'

// const pgConfig: pg.ConnectionConfig = {
//     user: process.env.AWSRDS_USER,
//     host: process.env.AWSRDS_AAHOST,
//     database: process.env.AWSRDS_AADB,
//     password: process.env.AWSRDS_PW,
//     port: 5432
// }
// const pgConn = new pg.Client(pgConfig);

// const app = express();

// app.get('/data/meetings', (req, resp) => {
//     const params = req.params;
// })

// app.listen(8088);

class Server {
    app: express.Application;
    aws = AWS;
    pgClient: pg.Client;
    dynamoClient: AWS.DynamoDB;

    constructor(pgConfig: pg.ConnectionConfig, dynamoConfig: AWS.DynamoDB.ClientConfiguration) {
        this.app = express();

        // const aws = AWS;
        this.aws.config = new AWS.Config();
        this.aws.config.region = "us-east-1";
        this.dynamoClient = new AWS.DynamoDB();
        
        this.pgClient = new pg.Client(pgConfig);
        this.pgClient.connect();
    }
}