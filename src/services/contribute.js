const util = require('../utilities/util');
const databaseUtil = require('../utilities/databaseUtil');
require('dotenv').config();

const uuid = require('uuid');
const AWS = require('aws-sdk');


AWS.config.update({
    region: 'us-east-1',
})

const dynamodb = new AWS.DynamoDB.DocumentClient();
const itemTable = 'gift.item' 

async function giftContribute() {
    const amazonURL = itemInfo.amazonURL
    const productName = itemInfo.name;
    const message = itemInfo.message;
    const img = itemInfo.img
    const description = itemInfo.description
    const price = itemInfo.price
    const contributions = itemInfo.contributions
}