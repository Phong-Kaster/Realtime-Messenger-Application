/* ======================= LIBRARY ======================= */
const contactModel = require('../models/contactModel.js');
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
        return res.status(500).send(errorsArray);
    }

    try 
    {
       let users = await contactModel.searchByKeyword( currentUserID , keyword );
       
       // render html lists users include their avatar , username, address,id
       return res.render("home/section/contactResultSearchUser", {users} );
    } 
    catch (error) {
        return res.status(500).send(error);
    }
}


/************************************************************
 * @currentUserID that account ID is logging in
 * @param {*} req 
 * @param {*} res
 * @returns success : true if send add friend request successfully
 ************************************************************/
let sendAddFriendRequest = async ( req , res )=>{
    let currentUserID = req.user._id;
    let targetID = req.body.uid;

    try 
    {
       let result = await contactModel.sendAddFriendRequest( currentUserID , targetID );
       return res.status(200).send( {success : !!result});
    } 
    catch (error) {
        return res.status(500).send(error);
    }
}


/*************************************************************
 * @currentUserID that account ID is logging in
 * @targetID is user ID whose we wanna cancel friend request 
 * @param {*} req 
 * @param {*} res 
 * @returns cancel friend request
 *************************************************************/
let cancelFriendRequest = async ( req , res)=>{

    let currentUserID = req.user._id;
    let targetID = req.body.uid;

    try 
    {
       let result = await contactModel.cancelFriendRequest( currentUserID , targetID );
       return res.status(200).send();
    } 
    catch (error) {
        return res.status(500).send(error);
    }
}


module.exports = {
    searchByKeyword : searchByKeyword,
    sendAddFriendRequest : sendAddFriendRequest,
    cancelFriendRequest : cancelFriendRequest
}