/* ======================= LIBRARY ======================= */
const userSchema = require('../schema/userSchema.js');
const bcrypt = require('bcrypt');
const saltRounds = 7; 
import uuidv4 from 'uuid/v4';
import {userError} from '../notification/english.js';
import {successfulNotice} from '../notification/english.js';

/* ============================ FUNCTION ============================ */
let signup = async ( email,gender,password ) =>{
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
        // return successful promise
        resolve( successfulNotice.userCreated( user.local.email ) );
    });
}

module.exports = signup;