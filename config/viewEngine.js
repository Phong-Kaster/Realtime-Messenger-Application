const express = require('express');
const expressEjsExtend = require('express-ejs-extend');

let configViewEngine = (app) =>{
    app.use( express.static("./public") );
    app.engine("ejs",expressEjsExtend);
    app.set("view engine","ejs");
    app.set("views","./views");
}

module.exports = configViewEngine;