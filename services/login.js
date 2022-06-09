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

  const dynamoUser = await userFunctions.getUser(username.toLowerCase().trim());
  if (!dynamoUser || !dynamoUser.username) {
    return util.buildResponse(403, { message: 'This user does not exist'});
  }

  if (!bcrypt.compareSync(password, dynamoUser.password)) {
    return util.buildResponse(403, { message: 'Password is incorrect'});
  }

  const userInfo = {
    username: dynamoUser.username,
    name: dynamoUser.name
  }
  const token = auth.generateToken(userInfo)
  const response = {
    user: userInfo,
    token: token
  }
  return util.buildResponse(200, response);
}


module.exports.login = login;