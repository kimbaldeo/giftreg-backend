const util = require('./utilities/util');

const registerService = require('./services/register');
const loginService = require('./services/login');
const verifyService = require('./services/verify');
const addItemService = require('./services/addItem')
const removeItemService = require('./services/removeItem')
const wishlistService = require('./services/wishlist')

const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';
const itemPath = '/additem';
const wishlistPath = '/wishlist'

exports.handler = async (event) => {
    console.log('Request Event: ', event);
    let response;
    switch(true) {
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = util.buildResponse(200);
            break;
        case event.httpMethod === 'POST' && event.path === registerPath:
            const registerBody = JSON.parse(event.body);
            response = await registerService.register(registerBody);
            break;
        case event.httpMethod === 'POST' && event.path === loginPath:
            const loginBody = JSON.parse(event.body);
            response = await loginService.login(loginBody);
            break;
        case event.httpMethod === 'POST' && event.path === verifyPath:
            const verifyBody = JSON.parse(event.body);
            response = verifyService.verify(verifyBody);
            break;
        case event.httpMethod === 'POST' && event.path === itemPath:
            const itemBody = JSON.parse(event.body);
            response = addItemService.addItem(itemBody);
            break;
        case event.httpMethod === 'GET' && event.path === wishlistPath:
            const wishlistBody = JSON.parse(event.body);
            response = wishlistService.addItem(wishlistBody);
                break;
        default:
            response = util.buildResponse(404, '404 Not Found');
    }
    return response;
};