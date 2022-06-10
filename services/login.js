const auth = require('../utilities/auth');
const userFunctions = require('../utilities/user')
const util = require('../utilities/util');

const bcrypt = require('bcryptjs');
const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'})
const userTable = 'gift.user';

// switched user to userInfo - cant remember why it was user - test to see if works
async function login(user) {
  const username = user.username;
  const password = user.password;
  if (!user || !username || !password) {
    return util.buildResponse(401, {
      message: 'A username and password are required'
    })
  }

  userFunctions.currentUser = await userFunctions.getUser(username.toLowerCase().trim());
  if (!userFunctions.currentUser || !userFunctions.currentUser.username) {
    return util.buildResponse(403, { message: 'This user does not exist'});
  }

  if (!bcrypt.compareSync(password, userFunctions.currentUser.password)) {
    return util.buildResponse(403, { message: 'Password is incorrect'});
  }

  const userInfo = {
    username: userFunctions.currentUser.username,
    name: userFunctions.currentUser.name
  }
  const token = auth.generateToken(userInfo)
  const response = {
    user: userInfo,
    token: token
  }
  return util.buildResponse(200, response);
}


module.exports.login = login;