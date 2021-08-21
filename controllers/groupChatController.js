import { validationResult } from "express-validator/check";
const groupChatModel = require('../models/groupChatModel.js');


/***************************************************************
 * @param {*} req 
 * @param {*} res 
 * @returns 
 ***************************************************************/
let createGroupChat = async ( req , res )=>{
    // define 2 array which contain errors & success notification
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
         let userID = req.user._id;
         let friendIDs = req.body.friendIDs;
         let groupChatName = req.body.groupChatName;

         let group = await groupChatModel.createGroupChat(userID , friendIDs , groupChatName );

         return res.status(200).send({group : group});
    } 
    catch (error) 
    {
        return res.status(500).send(error);
    }
}

module.exports = {
    createGroupChat : createGroupChat
}