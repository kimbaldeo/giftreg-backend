const jsonWebToken = require('jsonwebtoken');
require('dotenv').config();

function generateToken(userInfo) {
  if (!userInfo) {
    return null;
  }
  return jsonWebToken.sign(userInfo, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
}

function verifyToken(username, token) {
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