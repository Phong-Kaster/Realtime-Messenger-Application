/* ======================= LIBRARY ======================= */
const notificationModel = require('../models/notificationModel.js');
const contactModel = require('../models/contactModel.js');
const conversationModel = require('../models/conversationModel.js');



/*************************************************************
 * @notifications | array | notifications appear in notice icon
 * @quantityOfUnreadNotification | number | how many notification user have not read ?
 * 
 * @sentFriendRequestContact | object array | people that user sent to them a friend request
 * @receivedFriendRequestContact | object array | people that user received a friend request from them
 * @friendContact | object array | people are user's friends at the moment
 * 
 * @quantityOfFriendContact | number | indicates how many friends user has
 * @quantifyOfSentFriendRequestContact | number | indicates how many people user sent friend request & wait for their response
 * @quantityOfReceivedFriendRequestContacts | number | indicates how many friend requests user received
 * 
 * @param {*} req 
 * @param {*} res 
 *************************************************************/
let home = async (req,res) =>{
    
    let notifications = await notificationModel.retrieveNotifications(req.user._id);
    let quantityOfUnreadNotification = await notificationModel.countUnreadNotifications(req.user._id);
    let friendContacts = await contactModel.retrieveFriendContact(req.user._id);
    let sentFriendRequestContacts = await contactModel.retrieveSentFriendContact(req.user._id);
    let receivedFriendRequestContacts = await contactModel.retrieveReceivedFriendContact(req.user._id);
    
    let quantityOfFriendContacts = await contactModel.countFriendContact(req.user._id);
    let quantifyOfSentFriendRequestContact = await contactModel.countSentFriendContact(req.user._id);
    let quantityOfReceivedFriendRequestContacts = await contactModel.countReceivedFriendContact(req.user._id);
    
    let conversation = await conversationModel.retrieveConversation(req.user._id);
    let allChat = conversation.allConversation;
    let personalChat = conversation.personalConversation;
    let groupChat = conversation.groupConversation;

    return res.render("./home/section/content.ejs", {
        success : req.flash("success"),
        errors : req.flash("errors"),
        user : req.user,

        notifications : notifications,
        quantityOfUnreadNotification : quantityOfUnreadNotification,

        friendContacts : friendContacts,
        sentFriendRequestContacts : sentFriendRequestContacts,
        receivedFriendRequestContacts : receivedFriendRequestContacts,

        quantityOfFriendContacts : quantityOfFriendContacts,
        quantifyOfSentFriendRequestContact : quantifyOfSentFriendRequestContact,
        quantityOfReceivedFriendRequestContacts : quantityOfReceivedFriendRequestContacts,

        allChat : allChat,
        personalChat : personalChat,
        groupChat : groupChat
    });
};

module.exports = {
    home : home
};