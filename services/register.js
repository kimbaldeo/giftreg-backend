const uuid = require('uuid')
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'})

const util = require('../utilities/util');
const bcrypt = require('bcryptjs');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'gift.user';
const wishlistTable = 'gift.wishlist';
const itemTable = 'gift.item'

async function register(userInfo) {
  const name = userInfo.name;
  const email = userInfo.email;
  const username = userInfo.username;
  const password = userInfo.password;
  if (!username || !name || !email || !password) {
    return util.buildResponse(401, {
      message: 'All fields are required'
    })
  }

  const dynamoUser = await getUser(username.toLowerCase().trim());
  if (dynamoUser && dynamoUser.username) {
    return util.buildResponse(401, {
      message: 'This user already exists. Please choose a different username'
    })
  }

  // Create Wishlist ID and validate it doesn't already exist
  let wishlistID;
  let checkingWishlistID = true
  while(checkingWishlistID) {
    wishlistID = uuid.v4();
    const dynamodbWishlist = await getWishlist(wishlistID);
    if (!dynamodbWishlist) {
      checkingWishlistID = false
    } 
  }

  const encryptedPW = bcrypt.hashSync(password.trim(), 10);
  const user = {
    name: name,
    email: email,
    username: username.toLowerCase().trim(),
    password: encryptedPW,
    wishlistID: wishlistID
  }

  const saveUserResponse = await saveUser(user);
  if (!saveUserResponse) {
    return util.buildResponse(503, { message: 'Server Error. Please try again later.'});
  }

  return util.buildResponse(200, { username: username });
}

async function getUser(username) {
  const params = {
    TableName: userTable,
    Key: {
      username: username
    }
  }

  return await dynamodb.get(params).promise().then(response => {
    return response.Item;
  }, error => {
    console.error('There was an error getting user: ', error);
  })
}

async function saveUser(user) {
  const params = {
    TableName: userTable,
    Item: user
  }
  return await dynamodb.put(params).promise().then(() => {
    return true;
  }, error => {
    console.error('There was an error saving user: ', error)
  });
}

async function getWishlist(id) {
  const params = {
    TableName: wishlistTable,
    Key: {
      wishlistID: id
    }
  }

  return await dynamodb.get(params).promise().then(response => {
    return response.Item
  }, error => {
    return null
  })
}

module.exports.register = register;