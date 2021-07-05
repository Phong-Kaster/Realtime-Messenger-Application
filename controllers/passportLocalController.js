/* pass port local controller handle with local accounts which are created by user */

/* ======================= LIBRARY ======================= */
const passport = require('passport');
const passportLocal = require('passport-local');
const localStrategy = passportLocal.Strategy;
const userSchema = require('../schema/userSchema.js');
import {userError,notice,systemError} from '../notification/english.js';
/* ======================= FUNCTION ======================= */
let verifyLocalAccount = () =>
{

    passport.use(new localStrategy( 
    {
        usernameField : "email",
        passwordField : "password",
        passReqToCallback : true
    },
    async (req,email,password,done)=>
    {   
        try 
        {
            let user = await userSchema.findByEmail(email);
            // user exist or not
            if( !user )
            {
                return done(null,false,req.flash("errors",userError.inexistentAccount));
            }

            // lack email or password
            if( !email || !password)
            {
                return done(null,false,req.flash("errors",userError.lackUsernameOrPassword));
            }

            // account is still deactivated
            if( !user.local.isActive)
            {
                return done(null,false,req.flash( "errors", userError.deactivateAccount));
            }
            // password is incorrect
            let isCorrectPassword = await user.verifyPassword( password );
            if( !isCorrectPassword )
            {
                return done(null,false,req.flash("errors",userError.incorrectUsernameOrPassword));
            }

            return done(null,user,req.flash("success",notice.successfulLogin(user.username)));
        } 
        catch (error) 
        {
            console.log("Passport Local Controller Error: " + error);
            return done(null,false,req.flash("errors",systemError.overloadedSystem));
        }
    }));

    // store this login to a session for 1 day
    passport.serializeUser( (user,done)=> 
    {
        // store only id help to reduce session's size
        done(null,user._id);
    });

    // find user by id & store 
    passport.deserializeUser( async (id,done)=>
    {
        userSchema.findByIdentification(id)
            .then( (user) =>{ return done(null,user) })
            .catch( (error) =>{ return done(error,null) })
    });
};

module.exports = verifyLocalAccount;