/* ======================= LIBRARY ======================= */
const multer = require('multer');
const fileExtension = ["image/png","image/jpg","image/jpeg"];
import {systemError,notice} from '../notification/english.js';
import uuidv4 from 'uuid/v4';
const userModel = require('../models/userModel.js');
const fsExtra = require('fs-extra');
const storage = multer.diskStorage({
    destination : ( req , file , callback )=>{   
        callback(null,"public/images/users");
    },
    filename : ( req, file , callback )=>{   

        if( fileExtension.indexOf(file.mimetype) === -1)
        {
            return callback(systemError.unavailableFileExtension,null);
        }
        // create a random string with date now millisecond - uuidv4 - file name.For instance : 1928347932-8U9DG6CLOUD-Blue.jpg
        let avatarName = `${Date.now()}-${file.originalname}`;
        
        callback(null,avatarName);
    }
});
const avatarUploadFile = multer({
    storage : storage,
    limits : { fileSize : 5242880 }
}).single("avatar");// this "avatar" must be the same with value in /public/javascript/updateConfig.js - line 47

/* ======================= FUNCTION ======================= */
/**
 * update avatar that user want
 * public /user/update-avatar
 * @param {*} req 
 * @param {*} res 
 */
let updateAvatar = ( req,res ) =>{
    avatarUploadFile(req,res,async function(error){
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
            let userInformation = {
                avatar : req.file.filename,
                updateAt : Date.now()
            };
            // update information
            let user = await userModel.updateUserInformation(req.user._id,userInformation);

            // remove former avatar
            await fsExtra.remove(`public/images/users/${user.avatar}`);
            let result = {
                messenge : notice.successfullyUpdateAvatar,
                imageSource : `/images/users/${req.file.filename}`
            }
            return res.status(200).send(result);
        } 
        catch (error) 
        {
            console.log(error);
            return res.status(500).send(error);
        }
    });
}

module.exports = { 
    updateAvatar : updateAvatar 
};