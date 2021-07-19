/* ======================= LIBRARY ======================= */
const userSchema = require('../schema/userSchema.js');
const bcrypt = require('bcrypt');
const saltRounds = 7;
import { userError } from '../notification/english.js';

/**********************************************************************************************
 * 
 * @param {*} id that the identifier of user
 * @param {*} information is a bundle of information which user is trying to edit
 * @returns update information
 *********************************************************************************************/
let updateUserInformation = (id,information) =>{
    return userSchema.updateInformation(id,information);
}



/**********************************************************************************************
 * update current password
 * public /user-update-password
 * @param {*} id 
 * @param {*} password which include 3 fields : current password - new password - confirm new password 
 * @returns update current password -> new password
 **********************************************************************************************/
let updateUserPassword = (id,password)=>{
    return new Promise( async (resolve,reject)=>{
        // user authentication
        let user = await userSchema.findById(id);
        if( !user)
        {
            return reject(userError.inexistentAccount);
        }


        // check input data
        
        let isCorrectPassword = await user.verifyPassword(password.currentPassword);
        if( !isCorrectPassword )
        {
            return reject(userError.incorrectCurrentEmail)
        }

        // set salt to encrypt user password
        let salt = bcrypt.genSaltSync(saltRounds);
        // hash new password before storing
        let hashedPassword = bcrypt.hashSync(password.newPassword,salt);


        //finish
        await userSchema.updatePassword(id,hashedPassword);
        resolve(true);
    });
}


module.exports = {
    updateUserInformation : updateUserInformation,
    updateUserPassword : updateUserPassword
}