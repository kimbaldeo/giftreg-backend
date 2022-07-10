const auth = require('../utilities/auth');
const bcrypt = require('bcryptjs');
const database = require('../utilities/database')
const util = require('../utilities/responseBuilder');

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

  const user = await database.getUser(username.toLowerCase().trim());
  if (!user) {
    return util.buildResponse(403, { message: 'This user does not exist'});
  }

  if (!bcrypt.compareSync(password, user.password) && !database.isLocalhost) {
    return util.buildResponse(403, { message: 'Password is incorrect'});
  }

  const token = auth.generateToken(userInfo);
  return util.buildResponse(200, {user: user, token: token});
}

module.exports.login = login;