/* ======================= LIBRARY ======================= */
require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const connectDatabase = require('./config/connectDatabase.js');
const configViewEngine = require('./config/viewEngine');
const initRouter = require('./routes/inc.Router.js');
const bodyParser = require('body-parser');
/* ======================= FUNCTION ======================= */
connectDatabase();//connect to MongoDB
configViewEngine(app);//config View engine
app.use(bodyParser.urlencoded( { extended : true } ));
initRouter(app);

app.listen( port, () => {
    console.log(`Server is running on port http://localhost/${port}`);
});