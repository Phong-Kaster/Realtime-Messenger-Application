/* ======================= LIBRARY ======================= */
const contactModel = require('../models/contactModel.js');
import { validationResult } from "express-validator/check";

/************************************************************/
/************************* FUNCTION *************************/
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
    let senderID = req.user._id;
    let receiverID = req.body.uid;

    try 
    {
       let result = await contactModel.sendAddFriendRequest( senderID , receiverID );
       return res.status(200).send( {success : !!result} );
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
       await contactModel.cancelFriendRequest( currentUserID , targetID );
       return res.status(200).send();
    } 
    catch (error) {
        return res.status(500).send(error);
    }
}



/*************************************************************
 * @quantitySeenFriendContacts | number | number of friend contacts are appearing in screen
 * @receiverID | string | who is logging in
 * @returns |object | friend contact of @receiverID
 *************************************************************/
let retrieveMoreFriendContacts = async ( req , res )=>{
    try 
    {
        let quantitySeenFriendContacts = Number(req.params.quantitySeenFriendContacts);
        let receiverID = req.user._id;
        
        let friendContacts = await contactModel.retrieveMoreFriendContacts( receiverID , quantitySeenFriendContacts );
        return res.status(200).send(friendContacts);
    } 
    catch (error) 
    {
        return res.status(500).send(error);
    }
}



/*************************************************************
 * @quantitySeenSentFriendContacts | number | number of contacts who are appearing in screen
 * and were sent friend request from @receiverID
 * @receiverID | string | who is logging in
 * @returns |object | contact whom @receiverID sent friend request
 *************************************************************/
let retrieveMoreSentFriendContacts = async ( req , res )=>{
    try 
    {
        let quantitySeenSentFriendContacts = Number(req.params.quantitySeenSentFriendContacts);
        let receiverID = req.user._id;

        let sentFriendContacts = await contactModel.retrieveMoreSentFriendContact( receiverID , quantitySeenSentFriendContacts );
        return res.status(200).send(sentFriendContacts);
    } 
    catch (error) 
    {
        return res.status(500).send(error);
    }
}



/*************************************************************
 * @quantitySeenReceivedFriendContacts | number | number of contacts who sent friend request to @receiverID
 * @receiverID | string | who is logging in
 * @returns |object | contact who sent friend request to @receiverID
 *************************************************************/
let retrieveMoreReceivedFriendContacts = async ( req , res )=>{
    try 
    {
        let quantitySeenReceivedFriendContacts = Number(req.params.quantitySeenReceivedFriendContacts);
        let receiverID = req.user._id;
        let receivedFriendContacts = await contactModel.retrieveMoreReceivedFriendContact( receiverID , quantitySeenReceivedFriendContacts );
        return res.status(200).send(receivedFriendContacts);
    } 
    catch (error) 
    {
        return res.status(500).send(error);
    }
}



let denyReceivedFriendContact = async ( req ,res )=>{
    try 
    {
        let userID = req.user._id;
        let senderID = req.body.uid;
        
        let result = await contactModel.denyReceivedFriendContact( userID , senderID );
        return res.status(200).send( { success : !!result });
    } 
    catch (error) 
    {
        return res.status(500).send(error);
    }
}
module.exports = {
    searchByKeyword : searchByKeyword,
    sendAddFriendRequest : sendAddFriendRequest,
    cancelFriendRequest : cancelFriendRequest,

    retrieveMoreFriendContacts : retrieveMoreFriendContacts,
    retrieveMoreSentFriendContacts : retrieveMoreSentFriendContacts,
    retrieveMoreReceivedFriendContacts : retrieveMoreReceivedFriendContacts,

    denyReceivedFriendContact : denyReceivedFriendContact
}