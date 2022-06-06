const registerService = require('./service/register')
const registerService = require('./service/login')
const registerService = require('./service/verify')
const util = require('./utilities/util')

const healthPath = '/health'
const registerPath = '/register'
const loginPath = '/login'
const verifyPath = '/verify'

exports.handler = async (event) => {
    console.log('Request Event: ', event)
    let response 
    switch(true) {
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = util.buildResponse(200)
            break
        case event.httpMethod === 'POST' && event.path === registerPath:
            const registerBody = JSON.parse(event.body)
            response = await registerService.register(registerBody)
            break
        case event.httpMethod === 'POST' && event.path === loginPath:
            response = util.buildResponse(200)
            break
        case event.httpMethod === 'POST' && event.path === verifyPath:
            response = util.buildResponse(200) 
            break
        default:
            response = util.buildResponse(4040, '404 Not Found')
  }
  return response

};
