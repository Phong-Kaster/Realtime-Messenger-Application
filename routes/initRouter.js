/* ======================= LIBRARY ======================= */
const express = require('express');
const router = express.Router();
/* ======================= CONTROLLERS ======================= */
const authenticationController = require('../controllers/authenticationController.js');
const homeController = require('../controllers/homeController.js');


/* ======================= ROUTERS ======================= */
/**
 * @param app from exactly express module
 */
let initiateRouters = (app) =>{
    
    router.get("/",authenticationController.login );

    router.get("/login",authenticationController.login );
    
    router.get("/home",homeController.home );

    router.get("/logout",authenticationController.logout);

    return app.use("/",router);
}

module.exports = initiateRouters;