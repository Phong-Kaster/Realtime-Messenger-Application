const session = require('express-session');
const connectMongo = require('connect-mongo');

let mongoStore = connectMongo(session);

/**
 * this variable locate where session is stored
 */
let sessionStore = new mongoStore({
    url : `mongodb://127.0.0.1:27017/rma`,
    autoReconnect : true
 });

let configureSession = (app) =>{
    app.use(session( {
        key : "express.sid",
        secret : "mySecret",
        store : sessionStore,
        resave : true,
        saveUninitialized : false,
        cookie : { maxAge : 86400000 }
    }));
}

module.exports = configureSession;