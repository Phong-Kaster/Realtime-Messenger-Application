/* ======================= LIBRARY ======================= */
const express = require('express');
const router = express.Router();
/* ======================= CONTROLLERS ======================= */
const authenticationController = require('../controllers/authenticationController.js');
const homeController = require('../controllers/homeController.js');
/* ======================= MIDDLEWARES ======================= */
const signUpValidation = require('../middlewares/signUpValidation.js');
/* ======================= ROUTERS ======================= */
/**
 * @param app from exactly express module
 */
let initiateRouters = (app) =>{
    
    router.get("/",authenticationController.signin );
    router.get("/signin",authenticationController.signin );
    
    router.get("/home",homeController.home );

    router.post("/signup",signUpValidation,authenticationController.signup);

    return app.use("/",router);
}

module.exports = initiateRouters;