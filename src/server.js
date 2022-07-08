const express = require('express');
const app = express();
const PORT = 3000;
const addItemService = require('./services/addItem');
const contributeGiftService = require('./services/contributeGift');
const loginUserService = require('./services/loginUser');
const registerUserService = require('./services/registerUser');
const removeItemService = require('./services/removeItem');
const verifyTokenService = require('./services/verifyToken');
const fetchWishlistService = require('./services/fetchWishlist');
require('dotenv').config();

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server connected and listening to port: ${PORT}`);
});

// Health Check
app.get("/health", async (req, res) => {
    res.sendStatus(200);
});

// Register New User
app.post('/register', async (req, res) => {
    const response = await registerUserService.register(req.body);
    res.send(response);
});

// User Login
app.post('/login', async (req, res) => {
    const response = await loginUserService.login(req.body);
    res.send(response);
});

app.post('/verify', async (req, res) => {
    const response = await verifyTokenService.verify(req.body);
    res.send(response);
});

// Add Item To Wishlist
app.post('/additem', async (req, res) => {
    const response = await addItemService.addItem(req.body);
    res.send(response);
});

// Delete Item From Wishlist
app.delete('/removeitem', async (req, res) => {
    const response = await removeItemService.removeItem(req.body);
    res.send(response);
});

// Retrieve Wishlist
app.get('/wishlist', async (req, res) => {
    const response = await fetchWishlistService.fetchWishlist(req.params);
    res.send(response);
});

// Contribute To Item
app.post('/contribute', async (req, res) => {
    const response = await contributeGiftService.contribute(req.body);
    res.send(response);
});