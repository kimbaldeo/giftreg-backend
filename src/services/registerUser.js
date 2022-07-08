const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const responseBuilder = require('../utilities/responseBuilder');
const database = require('../utilities/database');
const { User } = require('../models/user');
const { Wishlist } = require('../models/wishlist')

/**
 * Register User Service
 * @param {JSON} userInfo 
 * @returns {Response}
 */
async function register(userInfo) {
  if (!userInfo.name || !userInfo.username || !userInfo.email || !userInfo.password) {
    return responseBuilder.buildResponse(401, {
      message: 'All fields are required'
    });
  }

  const getUserResponse = database.getUser(userInfo.username.toLowerCase().trim());
  if (getUserResponse) {
    return responseBuilder.buildResponse(401, {
      message: 'This username already exists. Please choose a different name'
    });
  }

  let wishlistID;
  let wishlistIDAlreadyExists = true;
  while(wishlistIDAlreadyExists) {
    wishlistID = uuid.v4();
    const getWishlistResponse = database.getWishlist(wishlistID);
    if (!getWishlistResponse) {
      wishlistIDAlreadyExists = false;
    }
  }

  const encryptedPassword = bcrypt.hashSync(userInfo.password.trim(), 10);
  const user = new User(userInfo.name, userInfo.username, userInfo.email, encryptedPassword, wishlistID);
  const wishlist = new Wishlist(wishlistID, []);

  const saveUserResponse = database.saveUser(user);
  if (!saveUserResponse) {
    return responseBuilder.buildResponse(503, {
      message: 'Server Failed To Save User. Please Try Again Later'
    });
  }

  const saveWishlistResponse = database.saveWishlist(wishlist);
  if (!saveWishlistResponse) {
    return responseBuilder.buildResponse(503, {
      message: 'Server Failed To Save Wishlist. Please Try Again Later'
    });
  }

  return responseBuilder.buildResponse(200, { user: user });
}

module.exports.register = register;