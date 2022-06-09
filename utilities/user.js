const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'})


const userTable = 'gift.user';
const wishlistTable = 'gift.wishlist';

const dynamodb = new AWS.DynamoDB.DocumentClient();

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

module.exports.getUser = getUser
module.exports.saveUser = saveUser
module.exports.getWishlist = getWishlist