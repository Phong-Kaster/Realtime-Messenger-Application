/* ======================= LIBRARY ======================= */
const userSchema = require('../schema/userSchema.js');
const bcrypt = require('bcrypt');
const saltRounds = 7; 
import uuidv4 from 'uuid/v4';// used to create token
import {userError} from '../notification/english.js';
const sendEmail = require('../config/email.js');
import {notice} from '../notification/english.js';
import {subject} from '../notification/english.js';
import {systemError} from '../notification/english.js';
/* ============================ FUNCTION ============================ */



/****************************************************************
 * let users create a new account for them
 * @param {*} email which is requested from register form - yourname@gmail.com
 * @param {*} gender which is requested from register form - male or female
 * @param {*} password which is requested from register form
 * @param {*} protocol which is a HTTP protocol or a HTTPS protocol - HTTP or HTTPS
 * @param {*} host which indicates this application's port - For instance : 3000 or 5000
 * @returns 
 ***************************************************************/
let signup = async ( email,gender,password,protocol , host ) =>{
    // this function returns a Promise
    return new Promise( async (resolve , reject )=>{
        
        let userByEmail = await userSchema.findByEmail(email);
        // check this email exist or not
        if( userByEmail )
        {
            // this email was removed
            if(userByEmail.deleteAt != null)
            {
                return reject( userError.removedAccount );
            }
            //this email is not activated
            if( !userByEmail.local.isActive )
            {
                return reject ( userError.deactivateAccount )
            }
            return reject( userError.usedAccount );
        }
        // set salt to encrypt user password
        let salt = bcrypt.genSaltSync(saltRounds);

        let userInformation = {
            username : email.split("@")[0],
            gender : gender,
            local : 
            {
                email : email,
                password : bcrypt.hashSync(password,salt),
                verifiedToken : uuidv4()
            }
        }

        // create a new account
        let user = await userSchema.createNew( userInformation );
        let verifyPath = `${protocol}://${host}/verify/${user.local.verifiedToken}`;
        // send email if it is sent return successful Notice
        // if not return systemError
        sendEmail( email,subject.confirmAccount, subject.template(verifyPath))
            .then( () =>{ resolve(notice.userCreated( user.local.email )); })
            .catch( async (error) =>{
                await userSchema.removeById( user._id );
                console.log("send email : "  + error); 
                reject( systemError.unsentEmail );
            });
        
    });
}



/***************************************************************
 * verify an account whether the user click the link in e-verify email
 * @param {*} verifiedToken which is created when user wanna create a new account
 * @returns notice 
 ***************************************************************/
let verifyAccount = ( verifiedToken ) =>{
    return new Promise( async (resolve , reject) =>
    {
        let status = await userSchema.findByToken(verifiedToken);

        if( !status )
        {
           return reject( userError.activatedAccount );
        }

        await userSchema.verifyToken(verifiedToken);
        resolve( notice.activatedAccount );       
    });
}

module.exports = 
{ 
    signup : signup,
    verifyAccount : verifyAccount
};