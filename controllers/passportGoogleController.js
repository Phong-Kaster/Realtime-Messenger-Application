/* pass port facebook controller handle with facebook accounts which are created by user */

/* ======================= LIBRARY ======================= */
const passport = require('passport');
const passportGoogle = require('passport-google-oauth');
const googleStrategy = passportGoogle.OAuth2Strategy;
const userSchema = require('../schema/userSchema.js');
import {userError,notice,systemError} from '../notification/english.js';
/* ======================= FUNCTION ======================= */
let verifyGoogleAccount = () =>
{
    passport.use(new googleStrategy( 
    {
        clientID : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL : process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback : true
    },
    async (req,accessToken,refreshToken,profile,done)=>
    {   
        try 
        {
            let user = await userSchema.findByGoogleUID(profile.id);

            if(user)
            {
                return done(null,user,req.flash("success",notice.successfulLogin(user.username)));
            }
            
            let userInformation = {
                username : profile.emails[0].value.split("@")[0] || "user",
                gender : profile.gender || "male",
                local : {isActive : true},
                google :
                {
                    uid : profile.id,
                    token : String,
                    email : profile.emails[0].value
                }
            };
            // what is created then it will passed in done() function -> newUser replaces user
            let newUser = await userSchema.createNew(userInformation);
            return done(null,newUser,req.flash("success",notice.successfulLogin(newUser.username)));
        } 
        catch (error) 
        {   
            console.log("Passport Google Controller Error: " + error);
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

module.exports = verifyGoogleAccount;