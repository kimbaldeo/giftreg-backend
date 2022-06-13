require('dotenv').config()
const auth = require('../utilities/auth');
const databaseUtil = require('../utilities/databaseUtil')
const util = require('../utilities/util');

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();

const userTable = 'gift.user';
const wishlistTable = 'gift.wishlist';
const itemTable = 'gift.item';


async function displayWishlist() {
    // get user to get wishlist id
    // use wishlist id from user to access wishlist
    const wishlist = await databaseUtil.getWishlist(databaseUtil.currentUser.wishlistID)
    if (!wishlist) {
    return util.buildResponse(503, {
      message: 'Cannot access wishlist'
    })
    }

    let items = [];
    for(let i = 0; i < wishlist.items.length; i++) {
        itemID = wishlist.items[i];
        const params = {
            TableName: itemTable,
            Key: {
                itemID: itemID
            }
        }
        const itemResponse = await databaseUtil.getItem(itemID);
        if (!itemResponse) {
            return util.buildResponse(503, { message: 'Server Error. Please try again later. Cannot access items in wishlist'})
        }
        items.push(itemResponse);
    }
}

module.exports.displayWishlist = aWishlist