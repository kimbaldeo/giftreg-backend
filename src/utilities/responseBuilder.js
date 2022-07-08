/**
 * Response Builder Helper Function
 * @param {number} statusCode 
 * @param {JSON} body 
 * @returns {Response}
 */
function buildResponse(statusCode, body) {
    return {
      statusCode: statusCode,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Authorization, X-Requested-With',
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods': 'POST, PUT, GET, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  }
  
  module.exports.buildResponse = buildResponse;