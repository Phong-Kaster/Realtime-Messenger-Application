/* ======================= LIBRARY ======================= */
const express = require('express');
const passport = require('passport');
const router = express.Router();

/* ======================= CONTROLLERS ======================= */
const authenticationController = require('../controllers/authenticationController.js');
const homeController = require('../controllers/homeController.js');

const passportLocalController = require('../controllers/passportLocalController.js');
const passportFacebookController = require('../controllers/passportFacebookController.js');

const passportGoogleController = require('../controllers/passportGoogleController.js');
const userController = require('../controllers/userController.js');

const contactController = require('../controllers/contactController.js');
const notificationController = require('../controllers/notificationController');

const conversationController = require('../controllers/conversationController.js');
const groupChatController = require('../controllers/groupChatController.js');

/* ======================= MIDDLEWARES ======================= */
const signUpValidation = require('../middlewares/signUpValidation.js');
const loginValidation = require('../middlewares/loginValidation.js');

const informationValidation = require('../middlewares/informationValidation.js');
const passwordValidation = require('../middlewares/passwordValidation.js');

const searchValidation = require('../middlewares/searchValidation');
const messageValidation = require('../middlewares/messageValidation.js');

const groupChatValidation = require('../middlewares/groupChatValidation.js');
/* ======================= FUNCTIONS ======================= */
// verify local account
passportLocalController();

// verify facebook account
// https://www.facebook.com/settings/?tab=applications
passportFacebookController();

// verify google account
// https://console.cloud.google.com/apis/credentials/oauthclient/40097144866-5263nqarejn79epho2lm432n2nsf2pq8.apps.googleusercontent.com?project=realtime-messenger-application
passportGoogleController();

/* ======================= ROUTERS ======================= */
/**
 * @param app from exactly express module
 */
let incRouters = (app) =>{
    
    // login
    router.get("/"      , loginValidation.isLogin , authenticationController.signin );
    router.get("/signin", loginValidation.isLogin , authenticationController.signin );
    router.post("/signin",passport.authenticate("local",{
        successRedirect : "/home",
        failureRedirect : "/",
        successFlash : true,
        failureFlash : true
    }));



    // home
    router.get("/home", loginValidation.isLogout , homeController.home );



    // sign up by local account 
    router.post("/signup" , signUpValidation , authenticationController.signup);



    // sign up by facebook account
    router.get("/auth/facebook" , loginValidation.isLogin , passport.authenticate("facebook",{scope : ["email"]}));
    router.get("/auth/facebook/callback", passport.authenticate("facebook",{
        successRedirect : "/home",
        failureRedirect : "/"
    }));



    // sign up by google account
    router.get("/auth/google" , loginValidation.isLogin , passport.authenticate("google",{scope : ["email"]}));
    router.get("/auth/google/callback", passport.authenticate("google",{
        successRedirect : "/home",
        failureRedirect : "/"
    }));



    // verify token to activate account
    router.get("/verify/:verifiedToken" , authenticationController.verify);



    // sign out
    router.get("/signout", authenticationController.signout);



    // user update 
    router.put("/user-update-avatar" , loginValidation.isLogout , userController.updateAvatar );
    router.put("/user-update-information" , loginValidation.isLogout , informationValidation , userController.updateInformation);
    router.put("/user-update-password" , loginValidation.isLogout , passwordValidation , userController.updatePassword);
    


    // search
    router.get("/search/:keyword" , loginValidation.isLogout , searchValidation , contactController.searchByKeyword);
    router.get("/search-friend/:keyword" , loginValidation.isLogout , searchValidation , contactController.searchFriendByKeyword);

    router.post("/send-add-friend-request" , loginValidation.isLogout , contactController.sendAddFriendRequest);
    router.delete("/cancel-friend-request" , loginValidation.isLogout , contactController.cancelFriendRequest);
    
    
    // notification read more
    router.get("/notification-read-more/:quantitySeenNotifications" , loginValidation.isLogout ,   notificationController.retrieveMoreNotifications);
    router.put("/notification-mark-as-read" , loginValidation.isLogout , notificationController.markAsRead);

    // load more contact
    router.get("/read-more-friend-contacts/:quantitySeenFriendContacts" , loginValidation.isLogout , contactController.retrieveMoreFriendContacts);
    router.get("/read-more-sent-friend-contacts/:quantitySeenSentFriendContacts" , loginValidation.isLogout , contactController.retrieveMoreSentFriendContacts);
    router.get("/read-more-received-friend-contacts/:quantitySeenReceivedFriendContacts" , loginValidation.isLogout , contactController.retrieveMoreReceivedFriendContacts);

    
    // accept & deny received friend request 
    router.delete("/deny-received-friend-contact" , loginValidation.isLogout , contactController.denyReceivedFriendContact);
    router.put("/accept-received-friend-contact" , loginValidation.isLogout , contactController.acceptReceivedFriendContact);
    router.delete("/unfriend" , loginValidation.isLogout , contactController.unfriend);

    // message
    router.post("/send-message" , loginValidation.isLogout , messageValidation , conversationController.sendMessage);
    router.post("/send-photo-message" , loginValidation.isLogout , conversationController.sendPhotoMessage);
    router.post("/send-document-message" , loginValidation.isLogout , conversationController.sendDocumentMessage);

    // create group chat
    router.post("/create-group-chat" , loginValidation.isLogout , groupChatValidation , groupChatController.createGroupChat);

    // read more conversation
    router.get("/read-more-conversation-all-chat/:quantityIndividualTab/:quantityGroupTab" , loginValidation.isLogout , conversationController.readMoreConversationAllChat);

    // read more message
    router.get("/read-more-message/:receiverID/:quantitySeenMessage/:sendToGroup" , loginValidation.isLogout , conversationController.readMoreMessage);
    return app.use("/",router);
}

module.exports = incRouters;