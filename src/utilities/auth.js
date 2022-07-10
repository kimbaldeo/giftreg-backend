const jsonWebToken = require('jsonwebtoken');
const uuid = require('uuid');
require('dotenv').config();

const isLocalhost = () => {
  return process.env.SERVER_LOCATION == 'development';
};

function generateToken(userInfo) {
  if (!userInfo) {
    return null;
  }

  if (isLocalhost) {
    return uuid.v4();
  }
  
  return jsonWebToken.sign(userInfo, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
}

function verifyToken(username, token) {
  if (isLocalhost) {
    return {
      verified: true,
      messagge: 'verified'
    }
  }
  return jsonWebToken.verify(token, process.env.JWT_SECRET, (error, response) => {
    if (error) {
      return {
        verified: false,
        message: 'invalid token'
      }
    }

    if (response.username !== username) {
      return {
        verified: false,
        message: 'invalid user'
      }
    }

    return {
      verified: true,
      message: 'verified'
    }
  })
}

exports.generateToken = generateToken;
exports.verifyToken = verifyToken;