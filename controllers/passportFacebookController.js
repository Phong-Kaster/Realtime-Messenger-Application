/* pass port facebook controller handle with facebook accounts which are created by user */

/* ======================= LIBRARY ======================= */
const passport = require('passport');
const passportFacebook = require('passport-facebook');
const facebookStrategy = passportFacebook.Strategy;
const userSchema = require('../schema/userSchema.js');
import {userError,notice,systemError} from '../notification/english.js';
/* ======================= FUNCTION ======================= */
let verifyFacebookAccount = () =>
{

    passport.use(new facebookStrategy( 
    {
        clientID : process.env.FACEBOOK_APP_ID,
        clientSecret : process.env.FACEBOOK_APP_SECRET,
        callbackURL : process.env.FACEBOOK_CALLBACK_URL,
        passReqToCallback : true,
        profileFields : [ "email","gender","displayName" ]
    },
    async (req,accessToken,refreshToken,profile,done)=>
    {   
        try 
        {
            let user = await userSchema.findByFacebookUID(profile.id);

            if(user)
            {
                return done(null,user,req.flash("success",notice.successfulLogin(user.username)));
            }
            
            let userInformation = {
                username : profile.displayName,
                gender : profile.gender || "male",
                local : {isActive : true},
                facebook :
                {
                    uid : profile.id,
                    token : String,
                    email : null
                }
            };
            
            // what is created then it will passed in done() function -> newUser replaces user
            let newUser = await userSchema.createNew(userInformation);
            return done(null,newUser,req.flash("success",notice.successfulLogin(newUser.username)));
        } 
        catch (error) 
        {   
            console.log("Passport Facebook Controller Error: " + error);
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
        userSchema.findByIdentificationSession(id)
            .then( (user) =>{ return done(null,user) })
            .catch( (error) =>{ return done(error,null) })
    });
};

module.exports = verifyFacebookAccount;