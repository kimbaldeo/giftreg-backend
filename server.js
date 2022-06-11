const express = require('express');
const app = express();
const PORT = 3000
const addItemService = require('./services/addItem')
require('dotenv').config();

app.use(express.json());

app.listen(PORT, () => {
    console.log(`listening to port: ${PORT}`)
});

app.post('/additem', async (req, res) => {
    if (req.headers.host.includes("localhost")) {
        process.env.NODE_ENV = 'development'
    }
    const response = await addItemService.addItem(req.body);
    res.send(response);
});