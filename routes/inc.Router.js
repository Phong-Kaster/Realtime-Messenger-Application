/* ======================= LIBRARY ======================= */
const express = require('express');
const passport = require('passport');
const router = express.Router();
/* ======================= CONTROLLERS ======================= */
const authenticationController = require('../controllers/authenticationController.js');
const homeController = require('../controllers/homeController.js');
const passportLocalController = require('../controllers/passportLocalController.js');
/* ======================= MIDDLEWARES ======================= */
const signUpValidation = require('../middlewares/signUpValidation.js');
const loginValidation = require('../middlewares/loginValidation.js');
/* ======================= FUNCTIONS ======================= */

//verify local account
passportLocalController();

/* ======================= ROUTERS ======================= */
/**
 * @param app from exactly express module
 */
let initiateRouters = (app) =>{
    
    // login
    router.get("/"      , loginValidation.isLogin , authenticationController.signin );
    router.get("/signin", loginValidation.isLogin , authenticationController.signin );
    router.post("/signin",passport.authenticate("local",{
        successRedirect : "/home",
        failureRedirect : "/",
        successFlash : true,
        failureFlash : true
    }));
    // home
    router.get("/home", loginValidation.isLogout , homeController.home );
    // signup
    router.post("/signup",signUpValidation,authenticationController.signup);
    // verify token to activate account
    router.get("/verify/:verifiedToken", authenticationController.verify);
    // sign out
    router.get("/signout",authenticationController.signout);

    return app.use("/",router);
}

module.exports = initiateRouters;