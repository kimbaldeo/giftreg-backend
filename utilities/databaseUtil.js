const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'})


const userTable = 'gift.user';
const wishlistTable = 'gift.wishlist';
const itemTable = 'gift.item';

const dynamodb = new AWS.DynamoDB.DocumentClient();

class DatabaseUtil {
  // Current User for the App Session
  currentUser = null;

  // User Database Functions
  async getUser(username) {
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
}

module.exports = new DatabaseUtil();