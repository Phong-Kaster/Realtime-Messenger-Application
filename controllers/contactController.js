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

    let userID = req.user._id;
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
       let users = await contactModel.searchByKeyword( userID , keyword );
       
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



/*************************************************************
 * views/home/section/contact.ejs - line 140
 * @param {*} userID | string | who is logging in , send unfriend request
 * @param {*} senderID | string | who send friend request to @userID & is refused request
 * @returns delete a new contact record
 *************************************************************/
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



/*************************************************************
 * views/home/section/contact.ejs - line 137
 * @param {*} userID | string | who is logging in , send unfriend request
 * @param {*} senderID | string | who send friend request to @userID & is accepted request
 * @returns create a new contact record
 *************************************************************/
let acceptReceivedFriendContact = async ( req , res )=>{
    try 
    {
        let userID = req.user._id;
        let senderID = req.body.uid;

        let result = await contactModel.acceptReceivedFriendContact( userID , senderID );
        return res.status(200).send({success: !!result});
    } 
    catch (error) 
    {
        return res.status(500).send(error);
    }
}



/*************************************************************
 * @param {*} userID | string | who is logging in , send unfriend request
 * @param {*} receiverID | string | whom @userID wanna unfriend
 * views/home/section/contact.ejs - line 75
 * @returns delete a contact record
 *************************************************************/
let unfriend = async ( req , res )=>{
    try 
    {
        let userID = req.user._id;
        let receiverID = req.body.receiver;
       
        let result = await contactModel.unfriend( userID , receiverID );
        return res.status(200).send({success: !!result});
    } 
    catch (error) 
    {
        return res.status(500).send(error);
    }
} 


/*************************************************************
 * this function is used to search friend of @userID , then @userID can create a group chat
 * @param {*} req 
 * @param {*} res 
 *************************************************************/
let searchFriendByKeyword = async ( req , res )=>{
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
        let keyword = req.params.keyword;
        let userID = req.user._id;

        let friends = await contactModel.searchFriendByKeyword( userID , keyword );
        return res.render("home/section/groupResultSearchFriend.ejs" , {friends} );
    }
    catch(error)
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

    denyReceivedFriendContact : denyReceivedFriendContact,
    acceptReceivedFriendContact : acceptReceivedFriendContact,
    unfriend : unfriend,

    searchFriendByKeyword : searchFriendByKeyword
}