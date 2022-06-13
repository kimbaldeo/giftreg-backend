const auth = require('../utilities/auth');
const databaseUtil = require('../utilities/databaseUtil')
const util = require('../utilities/util');
const bcrypt = require('bcryptjs');
const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});

async function login(user) {
  const username = user.username;
  const password = user.password;
  if (!user || !username || !password) {
    return util.buildResponse(401, {
      message: 'A username and password are required'
    })
  }

  const userResponse = await databaseUtil.getUser(username.toLowerCase().trim());
  if (!userResponse) {
    return util.buildResponse(403, { message: 'This user does not exist'});
  }
  databaseUtil.currentUser = userResponse;

  if (!bcrypt.compareSync(password, databaseUtil.currentUser.password)) {
    return util.buildResponse(403, { message: 'Password is incorrect'});
  }

  const userInfo = {
    username: databaseUtil.currentUser.username,
    name: databaseUtil.currentUser.name
  }
  
  const token = auth.generateToken(userInfo)
  const response = {
    user: userInfo,
    token: token
  }
  return util.buildResponse(200, response);
}


module.exports.login = login;