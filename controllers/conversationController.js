const conversationModel = require('../models/conversationModel.js');
import { validationResult } from "express-validator/check";

let sendMessage = async ( req , res )=>{
    // define 2 array which contain errors & success notification
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
        let sender = {
            id: req.user._id,
            username: req.user.username,
            avatar: req.user.avatar
        }
        
        let receiverID = req.body.receiverID;
        let content = req.body.content;
        let sendToGroup = req.body.sendToGroup;
        let message = await conversationModel.sendMessage(sender, receiverID, content, sendToGroup);
        return res.status(200).send({message: message});
    } 
    catch (error) 
    {
        return res.status(500).send(errorsArray);
    }
}   

module.exports = {
    sendMessage : sendMessage
}