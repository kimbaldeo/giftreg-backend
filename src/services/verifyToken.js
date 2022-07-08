const auth = require('../utilities/auth');
const responseBuilder = require('../utilities/responseBuilder');

/**
 * Verify Auth Token Service
 * @param {JSON} requestBody 
 * @returns {Response}
 */
function verify(requestBody) {
  if (!requestBody.user || !requestBody.user.username || !requestBody.token) {
    return responseBuilder.buildResponse(401, { 
      verified: false,
      message: 'Incorrect request body'
    })
  }

  const user = requestBody.user;
  const token = requestBody.token;
  const verification = auth.verifyToken(user.username, token);
  if (!verification.verified) {
    return responseBuilder.buildResponse(401, verification);
  }

  return responseBuilder.buildResponse(200, {
    verified: true,
    message: 'Success!',
    user: user,
    token: token
  })
}

module.exports.verify = verify;