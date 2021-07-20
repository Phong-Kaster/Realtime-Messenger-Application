const session = require('express-session');
const connectMongo = require('connect-mongo');
const mongoStore = connectMongo(session);

/**
 * this variable locate where session is stored
 */
let sessionStore = new mongoStore({
    url : `mongodb://127.0.0.1:27017/rma`,
    autoReconnect : true
 });
/**
 * configure session for application
 * @param {*} app 
 */
let sessionConfigure = (app) =>{
    app.use(session( {
        key : process.env.SESSION_KEY,
        secret : process.env.SESSION_SECRET,
        store : sessionStore,
        resave : true,
        saveUninitialized : false,
        cookie : { maxAge : 86400000 }
    }));
}

module.exports = { 
    sessionConfigure : sessionConfigure,
    sessionStore : sessionStore
}