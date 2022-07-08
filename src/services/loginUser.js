const auth = require('../utilities/auth');
const bcrypt = require('bcryptjs');
const database = require('../utilities/database')
const util = require('../utilities/responseBuilder');
const { User } = require('../models/user');

/**
 * Login Service
 * @param {JSON} userInfo
 * @returns {Response}
 */
async function login(userInfo) {
  const username = userInfo.username;
  const password = userInfo.password;
  if (!username || !password) {
    return util.buildResponse(401, {
      message: 'A username and password are required'
    });
  }

  const userResponse = database.getUser(username.toLowerCase().trim());
  if (!userResponse) {
    return util.buildResponse(403, { message: 'This user does not exist'});
  }

  if (!bcrypt.compareSync(password, userResponse.password)) {
    return util.buildResponse(403, { message: 'Password is incorrect'});
  }

  const user = new User(userResponse.name, userResponse.username, userResponse.email, userResponse.password, userResponse.wishlistID);
  const token = auth.generateToken(userInfo);
  return util.buildResponse(200, {user: user, token: token});
}

module.exports.login = login;