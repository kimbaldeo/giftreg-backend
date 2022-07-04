const util = require('../utilities/util');
const databaseUtil = require('../utilities/databaseUtil')
const uuid = require('uuid')
const bcrypt = require('bcryptjs');
const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'})

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

  const userResponse = await databaseUtil.getUser(username.toLowerCase().trim());
  if (userResponse) {
    return util.buildResponse(401, {
      message: 'This user already exists. Please choose a different username'
    })
  }
  databaseUtil.currentUser = userResponse;

  // Create Wishlist ID and validate it doesn't already exist
  let wishlistID;
  let checkingWishlistID = true;
  while(checkingWishlistID) {
    wishlistID = uuid.v4();
    const wishlistResponse = await databaseUtil.getWishlist(wishlistID);
    if (!wishlistResponse) {
      checkingWishlistID = false;
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

  const wishlist = {
    wishlistID: wishlistID,
    items: []
  }

 
  const saveUserResponse = await databaseUtil.saveUser(user);
  if (!saveUserResponse) {
    return util.buildResponse(503, { message: 'Server Error, could not save user. Please try again later.'});
  }
  const saveWishlistResponse = await databaseUtil.saveWishlist(wishlist);
  if (!saveWishlistResponse) {
    return util.buildResponse(503, { message: 'Server Error, could not store wishlist. Please try again later.'});
  }

  return util.buildResponse(200, { username: username });
}

module.exports.register = register;

