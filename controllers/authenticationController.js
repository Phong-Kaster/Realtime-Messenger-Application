/* ======================= LIBRARY ======================= */
import { validationResult } from "express-validator/check";
const authenticationModel = require('../models/authenticationModel.js');
import {notice} from '../notification/english.js';
/* ======================= FUNCTION ======================= */


/************************************************************
 * public get /signin
 * @param {*} req 
 * @param {*} res 
 * @returns home page , errors & success notification 
 ************************************************************/
let signin = (req,res) =>{
    return res.render("./authentication/authentication.ejs",{ 
        errors : req.flash("errors"), 
        success : req.flash("success") 
    });
};


/*************************************************************
 * public post /signup
 * @returns if user account was created successfully or not ??
 *************************************************************/
let signup = async (req,res) =>{
    // define 2 array which contain errors & success notification
    let errorsArray = [];
    let successArray = [];
    let validationErrors = validationResult(req);

    // check if errors exist or not ?
    if( !validationErrors.isEmpty() )
    {
        let errors = Object.values(validationErrors.mapped());
        // push error notification into errorsArray
        errors.forEach( element => {
            errorsArray.push( element.msg );
        });
        req.flash("errors",errorsArray);
        return res.redirect("/signin");
    }


    // sign up successfully
    try 
    {
        let createUserSuccess = await authenticationModel.signup(req.body.email , req.body.gender , req.body.password , req.protocol , req.get("host"));
        successArray.push(createUserSuccess);
        req.flash("success",successArray);
        return res.redirect("/signin");
    }
    //handle errors if happening 
    catch (error) 
    {
        errorsArray.push(error);
        req.flash("errors",errorsArray);
        return res.redirect("/signin");
    }
}


/**************************************************************
 * private post /verify/:verifiedToken
 * @param {*} req 
 * @param {*} res 
 * @returns verified result
 *************************************************************/
let verify =  async (req,res) =>{
    let errorsArray = [];
    let successArray = [];

    try 
    {
        let status = await authenticationModel.verifyAccount(req.params.verifiedToken);
        successArray.push( status );
        req.flash( "success",successArray );
        return res.redirect("/signin");
    } 
    catch (error) 
    {
        errorsArray.push( error );
        req.flash("errors",errorsArray);
        return res.redirect("/signin");
    }
}


/**************************************************************
 * public get /signout
 * @param {*} req 
 * @param {*} res 
 * @returns account log out - remove account's session
 *************************************************************/
let signout = (req,res) =>{
    // remove session passport user
    req.logout();
    req.flash("success",notice.successfulLogout);
    return res.redirect("/");
}
module.exports = {
    signin : signin,
    signup : signup,
    verify : verify,
    signout : signout
};