/* ======================= LIBRARY ======================= */
require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const connectDatabase = require('./config/connectDatabase.js');
const configViewEngine = require('./config/viewEngine');
const initRouter = require('./routes/inc.Router.js');
const bodyParser = require('body-parser');
const connectFlash = require('connect-flash');
const configSession = require('./config/session.js');
const passport = require('passport');
const pem = require('pem');
const https = require('https');
/* ======================= FUNCTION ======================= */
// pem.config({
//   pathOpenSSL: '/usr/local/ssl'
// })

// fake HTTPS method to trick Facebook security
/*pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
    if (err) 
    {
      console.log("pem error : " + err);
      throw err
    }

    //connect to MongoDB
    connectDatabase();

    //config session
    configSession(app);

    //config View engine
    configViewEngine(app);
 

    app.use(bodyParser.urlencoded( { extended : true } ));

    // call connect flash
    app.use(connectFlash());

    // passport must stand between connect database and initRouter
    app.use(passport.initialize());
    app.use(passport.session());

    // initialize routers
    initRouter(app);
   
    https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen( port, () => {
      console.log(`->Server is running on port https://localhost:${process.env.APP_PORT} to connect database ${process.env.DATABASE_NAME}`);
      console.log(`->rma stands for ${process.env.STANDARD_DATABASE_NAME}`)
  })
  })*/

/**this code block will be re-used  when it public in internet*/

//connect to MongoDB
connectDatabase();

//config session
configSession(app);

//config View engine
configViewEngine(app);

app.use(bodyParser.urlencoded( { extended : true } ));

// call connect flash
app.use(connectFlash());

// passport must stand between connect database and initRouter
app.use(passport.initialize());
app.use(passport.session());

// initialize routers
initRouter(app);
/* ======================= LISTEN ON PORT 3000 ======================= */
app.listen( port, () => {
    console.log(`->Server is running on port http://localhost:${process.env.APP_PORT} to connect database ${process.env.DATABASE_NAME}`);
    console.log(`->rma stands for ${process.env.STANDARD_DATABASE_NAME}`);
});