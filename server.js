const express = require('express');
const app = express();
const methodOverride = require('method-override');
const PORT = 4000

const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
const dynamodb = new AWS.DynamoDB.DocumentClient()
const bodyParser = require('body-parser');



app.listen(PORT, () => {
    console.log(`listening to port: ${PORT}`)
})