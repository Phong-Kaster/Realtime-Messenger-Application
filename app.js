require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const connectDatabase = require('./config/connectDatabase.js');
connectDatabase();


app.listen( port, () => {
    console.log(`Server is running on port http://localhost/${port}`);
});