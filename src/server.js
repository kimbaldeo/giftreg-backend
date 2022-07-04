const express = require('express');
const app = express();
const PORT = 3000
const addItemService = require('./services/addItem')
require('dotenv').config();

app.use(express.json());

app.listen(PORT, () => {
    console.log(`listening to port: ${PORT}`)
});

app.get("/health", async (req, res) => {
    res.status(200)
});

app.post('/additem', async (req, res) => {
    if (req.headers.host.includes("localhost")) {
        process.env.NODE_ENV = 'development'
    }
    const response = await addItemService.addItem(req.body);
    res.send(response);
});

const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';
const itemPath = '/additem';
const wishlistPath = '/wishlist'


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
        response = wishlistService.displayWishlist();
            break;
    default:
        response = util.buildResponse(404, '404 Not Found');
}