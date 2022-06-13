const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'})
require('dotenv').config();

const userTable = 'gift.user';
const wishlistTable = 'gift.wishlist';
const itemTable = 'gift.item';

const dynamodb = new AWS.DynamoDB.DocumentClient();

function isLocalhost() {
  return process.env.NODE_ENV === 'development';
}

class DatabaseUtil {
  // Current User for the App Session
  currentUser = null

  // User Database Functions
  async getUser(username) {
    if (isLocalhost()) {
      return {
        name: 'Kimberly',
        email: 'kbaldeotest@gmail.com',
        username: username,
        password: 'password1!',
        wishlistID: '12345'
      }
    }
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


  async saveUser(user) {
    if (isLocalhost()) {
      return user;
    }
      const params = {
        TableName: userTable,
        Item: user
      }

      return await dynamodb.put(params).promise().then(() => {
        return true;
      }, error => {
      console.error('There was an error saving user: user could not save', error)
      });
  }

  // Wishlist Database Functions
  async getWishlist(id) {
    if (isLocalhost()) {
      return {
        id: '12345',
        items: ['sample']
      }
    }
    const params = {
        TableName: wishlistTable,
        Key: {
          wishlistID: id
        }
    }

    return await dynamodb.get(params).promise().then(response => {
        return response.Item
    }, error => {
      // Returning null because we want to keep polling DB to store wishlist with unique ID
        return null
    })
  }

  async saveWishlist(wishlist) {
    if (isLocalhost()) {
      return wishlist
    }
    const params = {
      TableName: wishlistTable,
      Item: wishlist
    }

    return await dynamodb.put(params).promise().then(() => {
      return true;
    }, error => {
    console.error('There was an error saving user: we could not create a wishlist ', error)
    });
  }

  // Item Database Functions
  async getItem(id) {
    if (isLocalhost()) {
      return {
        itemID: "qwerty123",
        amazonURL: "www.amazon.url",
        productName: "soap",
        productImg: "img.url",
        message: "a simple message",
        price: 12,
        contributions: 7
      }
    }
    const params = {
      TableName: itemTable,
      Key: {
        itemID: id
      }
    }

    return await dynamodb.get(params).promise().then(response => {
      return response.Item
    }, error => {
      // Returning null because we want to keep polling DB to store item with unique ID
      return null
    })
  }

  async saveItem(item) {
    if (isLocalhost()) {
      return item;
    }
    const params = {
      TableName: itemTable,
      Item: item
    }
    return await dynamodb.put(params).promise().then(() => {
      return true;
    }, error => {
      console.error('There was an error saving item saveItem response', error)
    });
  }

  isLocalhost() {
    return process.env.NODE_ENV === 'development';
  }
}

module.exports = new DatabaseUtil();