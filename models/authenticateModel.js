/* ======================= LIBRARY ======================= */
const userSchema = require('../schema/userSchema.js');
const bcrypt = require('bcrypt');
const saltRounds = 7; 
import uuidv4 from 'uuid/v4';
import {userError} from '../notification/english.js';
const sendEmail = require('../config/email.js');
import {successfulNotice} from '../notification/english.js';
import {subject} from '../notification/english.js';
import {systemError} from '../notification/english.js';
/* ============================ FUNCTION ============================ */
/**
 * 
 * @param {*} email which is requested from register form - yourname@gmail.com
 * @param {*} gender which is requested from register form - male or female
 * @param {*} password which is requested from register form
 * @param {*} protocol which is a HTTP protocol or a HTTPS protocol - HTTP or HTTPS
 * @param {*} host which indicates this application's port - For instance : 3000 or 5000
 * @returns 
 */
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
                verifyToken : uuidv4()
            }
        }

        // create a new account
        let user = await userSchema.createNew( userInformation );
        let verifyPath = `${protocol}://${host}/verify/${user.local.verifyToken}`;
        // send email if it is sent return successful Notice
        // if not return systemError
        sendEmail( email,subject.confirmAccount, subject.template(verifyPath))
            .then( () =>{ resolve(successfulNotice.userCreated( user.local.email )); })
            .catch( async (error) =>{
                await userSchema.removeById( user._id );
                console.log(error); 
                reject( systemError.unsentEmail );
            });
        
    });
}

module.exports = signup;