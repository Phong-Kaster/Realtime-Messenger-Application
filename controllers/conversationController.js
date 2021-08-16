/*********************** LIBRARY ************************/
const conversationModel = require('../models/conversationModel.js');
const multer = require('multer');
const fsExtra = require('fs-extra');
import { validationResult } from "express-validator/check";
import {systemError,notice} from '../notification/english.js';



/**************************************************************
 * handle function send text message
 * @param {*} req 
 * @param {*} res 
 **************************************************************/
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
        return res.status(500).send(error);
    }
}   


/***************************************************************************************************/
/************************************ SEND A PHOTO AS A MESSAGE ************************************/
/***************************************************************************************************/
const fileExtension = ["image/png","image/jpg","image/jpeg"];
const photoStorage = multer.diskStorage({
    destination : ( req , file , callback )=>{   
        callback(null,"public/images/chat");
    },
    filename : ( req, file , callback )=>{   

        if( fileExtension.indexOf(file.mimetype) === -1)
        {
            return callback(systemError.unavailableFileExtension,null);
        }
        // create a random string with date now millisecond - uuidv4 - file name.For instance : 1928347932-8U9DG6CLOUD-Blue.jpg
        let photoName = `${file.originalname}`;
        
        callback(null,photoName);
    }
});
const uploadPhotoMessage = multer({
    storage : photoStorage,
    limits : { fileSize : 5242880 }
}).single("my-image-chat");
/**************************************************************
 * Handle function send photo message with @Multer library
 * To store a file to MongoDB, uploadPhotoMessage must be used
 * @param {*} req 
 * @param {*} res
 * Step 0 : First of all, Photo which is sent, is stored in "public/image/chat"
 * Step 1 : Check if error happens or not
 * Step 2 : Retrieve sender's information & sent photo
 * Step 3 : Store the photo to MongoDB
 * Step 4 : The photo in temporary folder is also deleted
 * 
 **************************************************************/
let sendPhotoMessage = ( req ,res )=>{
    /* Step 0 */
    uploadPhotoMessage( req , res , async (error)=>{
        /* Step 1 */
        if(error)
        {   
            if(error.messenge)
            {
                return res.status(500).send(systemError.avatarOversize);
            }
            return res.status(500).send(error);
        }

        try 
        {
            /* Step 2 */
            let sender = {
                id: req.user._id,
                username: req.user.username,
                avatar: req.user.avatar
            }
            
            let receiverID = req.body.receiverID;
            let photo = req.file;
            let sendToGroup = req.body.sendToGroup;

            /* Step 3 */
            let photoMessage = await conversationModel.sendPhotoMessage(sender, receiverID, photo, sendToGroup);
            
            /* Step 4 */
            await fsExtra.remove(`public/images/chat/${photoMessage.file.fileName}`);
            return res.status(200).send({message: photoMessage});
        } 
        catch (error) 
        {
            return res.status(500).send(error);
        }
    });
}


/***************************************************************************************************/
/************************************ SEND A PHOTO AS A MESSAGE ************************************/
/***************************************************************************************************/
const documentExtension = ["image/png","image/jpg","image/jpeg"];
const documentStorage = multer.diskStorage({
    destination : ( req , file , callback )=>{   
        callback(null,"public/images/chat");
    },
    filename : ( req, file , callback )=>{
        // create a random string with date now millisecond - uuidv4 - file name.For instance : 1928347932-8U9DG6CLOUD-Blue.jpg
        let documentName = `${file.originalname}`;
        
        callback(null,documentName);
    }
});
const uploadDocumentMessage = multer({
    storage : documentStorage,
    limits : { fileSize : 5242880 }
}).single("my-attachment-chat");



let sendDocumentMessage = ( req , res )=>{
    uploadDocumentMessage( req , res , async (error)=>{
        /* Step 1 */
        if(error)
        {   
            if(error.messenge)
            {
                return res.status(500).send(systemError.avatarOversize);
            }
            return res.status(500).send(error);
        }

        try 
        {
            /* Step 2 */
            let sender = {
                id: req.user._id,
                username: req.user.username,
                avatar: req.user.avatar
            }
            
            let receiverID = req.body.receiverID;
            let document = req.file;
            let sendToGroup = req.body.sendToGroup;
            
            /* Step 3 */
            let documentMessage = await conversationModel.sendDocumentMessage(sender, receiverID, document, sendToGroup);
            
            /* Step 4 */
            await fsExtra.remove(`public/images/chat/${documentMessage.file.fileName}`);
            return res.status(200).send({message: documentMessage});
        } 
        catch (error) 
        {
            console.log(error);
            return res.status(500).send(error);
        }
    });
}
module.exports = {
    sendMessage : sendMessage,
    sendPhotoMessage : sendPhotoMessage,
    sendDocumentMessage : sendDocumentMessage
}