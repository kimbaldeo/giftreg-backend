const util = require('../utilities/util');
const databaseUtil = require('../utilities/databaseUtil');
require('dotenv').config();

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1'
})

async function addItem(itemInfo) {
  const amazonURL = itemInfo.amazon_url;
  const productName = itemInfo.product_name;
  const message = itemInfo.message;
  const img = itemInfo.product_img;
  const price = itemInfo.price;
  const contributions = itemInfo.contributions
  if (!amazonURL || !productName || !message) {
    return util.buildResponse(401, {
      message: 'The product URL, product name and a brief message are required'
    })
  }

  // Get user's wishlistID
  const wishlist = await databaseUtil.getWishlist(databaseUtil.currentUser.wishlistID)
  if (!wishlist) {
    return util.buildResponse(503, {
      message: 'Cannot access your wishlist, please sign in or login'
    })
  }


  // Create itemID
  let itemID;
  let checkingItemID = true
  while(checkingItemID) {
    itemID = uuid.v4();
    if (databaseUtil.isLocalhost()) {
      break;
    }
    const dynamodbItem = await databaseUtil.getItem(itemID);
    if (!dynamodbItem) {
      checkingItemID = false
    } 
  }

  const item = {
    itemID: itemID,
    amazonURL: amazonURL,
    productName: productName.trim(),
    productImg: img,
    message: message,
    price: price,
    contributions: contributions,
  }


  const saveItemResponse = await databaseUtil.saveItem(item);
  if (!saveItemResponse) {
    return util.buildResponse(503, { message: 'Server Error. Please try again later. !Saveitem response'});
  }

  wishlist.items.push(itemID);
  const saveWishlistResponse = await databaseUtil.saveWishlist(wishlist);
  if (!saveWishlistResponse) {
    return util.buildResponse(503, { message: 'Server Error, could not store item to wishlist. Please try again later.'});
  }

  return util.buildResponse(200, { user: databaseUtil.currentUser });
}

module.exports.addItem = addItem
