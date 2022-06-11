const express = require('express');
const app = express();
const PORT = 3000
const addItemService = require('./services/addItem')

app.use(express.json());

app.listen(PORT, () => {
    console.log(`listening to port: ${PORT}`)
});

app.get("/health", (req, res) => {
    res.send("Healthy");
});

app.post('/additem', async (req, res) => {
    const response = await addItemService.addItem(req.body);
    res.send(response);
});