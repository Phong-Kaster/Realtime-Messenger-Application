/* ======================= LIBRARY ======================= */
const searchModel = require('../models/searchModel.js');
import { validationResult } from "express-validator/check";

/* ======================= FUNCTION ======================= */

/************************************************************
 * @currentUserID that account ID is logging in
 * @keyword that is condition we input to search
 * @users whose we can send a friend request because they are not our friend
 * @param {*} req 
 * @param {*} res
 * @returns users that their username include "keyword" we input
 ************************************************************/
let searchByKeyword = async ( req , res )=>{

    let currentUserID = req.user._id;
    let keyword = req.params.keyword;

    // handle errors server-side
    let errorsArray = [];
    let errorValidation = validationResult(req);
    
    if( !errorValidation.isEmpty() )
    {
        let errors = Object.values(errorValidation.mapped());
        errors.forEach( (element)=>{
            errorsArray.push(element.msg);
        })
        console.log(errorsArray)
        return res.status(500).send(errorsArray);
    }

    try 
    {
       let users = await searchModel.searchByKeyword( currentUserID , keyword );
       
       // render html lists users include their avatar , username, address,id
       return res.render("home/section/contactResultSearchUser", {users} );
    } 
    catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}



module.exports = {
    searchByKeyword : searchByKeyword
}