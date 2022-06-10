const util = require('../utilities/util');
const userFunctions = require('../utilities/user')

const uuid = require('uuid')
const bcrypt = require('bcryptjs');
const AWS = require('aws-sdk');


AWS.config.update({region: 'us-east-1'})
const userTable = 'gift.user';
const wishlistTable = 'gift.wishlist';

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

  userFunctions.currentUser = await userFunctions.getUser(username.toLowerCase().trim());
  if (userFunctions.currentUser && userFunctions.currentUser.username) {
    return util.buildResponse(401, {
      message: 'This user already exists. Please choose a different username'
    })
  }

  // Create Wishlist ID and validate it doesn't already exist
  let wishlistID;
  let checkingWishlistID = true
  while(checkingWishlistID) {
    wishlistID = uuid.v4();
    const dynamodbWishlist = await userFunctions.getWishlist(wishlistID);
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

  const saveUserResponse = await userFunctions.saveUser(user);
  if (!saveUserResponse) {
    return util.buildResponse(503, { message: 'Server Error. Please try again later.'});
  }

  return util.buildResponse(200, { username: username });
}

module.exports.register = register;