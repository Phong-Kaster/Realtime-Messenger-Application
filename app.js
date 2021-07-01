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
/* ======================= FUNCTION ======================= */
connectDatabase();//connect to MongoDB
configSession(app);//config session
configViewEngine(app);//config View engine
app.use(bodyParser.urlencoded( { extended : true } ));
app.use(connectFlash());
initRouter(app);
/* ======================= LISTEN ON PORT 3000 ======================= */
app.listen( port, () => {
    console.log(`->Server is running on port http://localhost/${process.env.APP_PORT} to connect database ${process.env.DATABASE_NAME}`);
    console.log(`->rma stands for ${process.env.STANDARD_DATABASE_NAME}`);
});