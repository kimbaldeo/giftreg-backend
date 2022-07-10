const AWS = require('aws-sdk');
const { Item } = require('../models/item');
const { User } = require('../models/user');
const { Wishlist } = require('../models/wishlist');
require('dotenv').config();

const userTable = 'gift.user';
const wishlistTable = 'gift.wishlist';
const itemTable = 'gift.item';

AWS.config.update({region: 'us-east-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();

const isLocalhost = () => {
  return process.env.SERVER_LOCATION == 'development';
};

/**
 * fetch user from database
 * @param {string} username 
 * @returns {User?}
 */
async function getUser(username) {
  if (isLocalhost) {
    return new User('Kimberly', username, 'kbaldeotest@gmail.com', 'password1!', '12345');  
  }

  const params = {
    TableName: userTable,
    Key: {
      username: username
    }
  };

  return await dynamodb.get(params).promise().then(response => {
    return response.Item;
    }, 
    error => {
      console.error(`There was an error retrieving the user: ${error}`);
      return null;
    });
}

/**
 * store user in database
 * @param {User} user 
 * @returns {boolean}
 */
async function saveUser(user) {
  if (isLocalhost) {
    return true;
  }

  const params = {
    TableName: userTable,
    Item: user
  };

  return await dynamodb.put(params).promise().then(response => {
    return true;
  },
  error => {
    console.error(`There was an error saving the user: ${error}`);
    return false;
  });
}

/**
 * fetch wishlist from database
 * @param {string} id 
 * @returns {Wishlist?}
 */
async function getWishlist(id) {
  if (isLocalhost) {
    return new Wishlist('12345', ['12345', '54321', '11111']);
  }

  const params = {
    TableName: wishlistTable,
    Key: {
      wishlistID: id
    }
  };

  return await dynamodb.get(params).promise().then(response => {
    return response.Item;
  }, error => {
    console.error(`There was an error retrieving the wishlist: ${error}`);
    return null;
  });
}

/**
 * store wishlist in database
 * @param {Wishlist} wishlist 
 * @returns {boolean}
 */
async function saveWishlist(wishlist) {
  if (isLocalhost) {
    return true;
  }

  const params = {
    TableName: wishlistTable,
    Item: wishlist
  };

  return await dynamodb.put(wishlist).promise().then(response => {
    return true;
  }, error => {
    console.error(`There was an error storing the wishlist: ${error}`);
    return false;
  });
}

/**
 * fetch item from database
 * @param {string} id 
 * @returns {Item?}
 */
async function getItem(id) {
  if (isLocalhost) {
    return new Item('qwerty123', 'www.amazon.url', 'soap', 'img.url', 'a simple message', 12, 7);
  }

  const params = {
    TableName: itemTable,
    Key: {
      itemID: id
    }
  };

  return await dynamodb.get(params).promise().then(response => {
    return response.Item;
  }, error => {
    console.error(`There was an error retrieving the item: ${error}`);
    return null;
  });
}

/**
 * store item in database
 * @param {Item} item 
 * @returns {boolean}
 */
async function saveItem(item) {
  if (isLocalhost) {
    return true;
  }

  const params = {
    TableName: itemTable,
    Item: item
  };

  return await dynamodb.put(params).promise().then(response => {
    return true;
  }, error => {
    console.error(`There was an error saving the item: ${error}`);
    return false;
  });
}

exports.isLocalhost = isLocalhost;
exports.getUser = getUser;
exports.saveUser = saveUser;
exports.getWishlist = getWishlist;
exports.saveWishlist = saveWishlist;
exports.getItem = getItem;
exports.saveItem = saveItem;