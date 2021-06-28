require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const connectDatabase = require('./config/connectDatabase.js');
const configViewEngine = require('./config/viewEngine');

connectDatabase();//connect to MongoDB
configViewEngine(app);//config View engine

app.get("/login" , (req,res) =>{
    return res.render("login");
})

app.get("/home" , (req,res) =>{
    return res.render("home");
})

app.listen( port, () => {
    console.log(`Server is running on port http://localhost/${port}`);
});