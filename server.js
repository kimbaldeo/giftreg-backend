const express = require('express');
const app = express();
const methodOverride = require('method-override');
const PORT = 4000

app.listen(PORT, () => {
    console.log(`listening to port: ${PORT}`)
})