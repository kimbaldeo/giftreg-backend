const util = require('../utilities/util');
const userFunctions = require('../utilities/user');
require('dotenv').config();

const uuid = require('uuid');
const AWS = require('aws-sdk');


AWS.config.update({
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_K
})

const dynamodb = new AWS.DynamoDB.DocumentClient();
const itemTable = 'gift.item' 


async function addItem(itemInfo) {
  const amazonURL = itemInfo.amazonURL
  const productName = itemInfo.name;
  const message = itemInfo.message;
  const img = itemInfo.img
  const description = itemInfo.description
  const price = itemInfo.price
  const contributions = itemInfo.contributions
  if (!amazonURL || !productName || !message) {
    return util.buildResponse(401, {
      message: 'The product URL, product name and a brief message are required'
    })
  }

  // Get user's wishlistID
  userFunctions.getUser
  userFunctions.getWishlist


  // Create itemID
  let itemID;
  let checkingItemID = true
  while(checkingItemID) {
    itemID = uuid.v4();
    const dynamodbItem = await getItemID(itemID);
    if (!dynamodbItem) {
      checkingItemID = false
    } 
  }

  const item = {
    itemID: itemID,
    amazon_url: amazonURL,
    product_name: productName.trim(),
    productImg: img,
    product_description: description,
    message: message,
    price: price,
    contributions: contributions,
    wishlistID: wishlistID
  }

  const saveItemResponse = await saveItem(item);
  if (!saveItemResponse) {
    return util.buildResponse(503, { message: 'Server Error. Please try again later.'});
  }
// Fix in index file 
  return util.buildResponse(200, { username: username });
}

async function saveItem(item) {
  const params = {
    TableName: itemTable,
    Item: item
  }
  return await dynamodb.put(params).promise().then(() => {
    return true;
  }, error => {
    console.error('There was an error saving item ', error)
  });
}

async function getItemID(id) {
  const params = {
    TableName: itemTable,
    Key: {
      itemID: id
    }
  }

  return await dynamodb.get(params).promise().then(response => {
    return response.Item
  }, error => {
    return null
  })
}

module.exports.addItem = addItem