/* ======================= LIBRARY ======================= */
const contactSchema = require('../schema/contactSchema.js');
const userSchema = require('../schema/userSchema.js');
const notificationSchema = require('../schema/notificationSchema.js');
const _ = require('lodash');
/* ======================= FUNCTION ======================= */

/************************************************************
 * @param {*} currentUserID that account ID is logging in
 * @param {*} keyword that is condition we input to search
 * @invalidUserIDs is an array that contains User IDs who are our friends
 * @friendsOfCurrentUserID is an array that is result from query searchFriendsByID
 * @validUserIDs is an array that include User IDs who are not our friends
 * @returns validUserIDs
 ************************************************************/
let searchByKeyword = ( currentUserID , keyword )=>{
    return new Promise( async ( resolve , reject )=>{

        let invalidUserIDs = [currentUserID];
        let friendsOfCurrentUserID = await contactSchema.searchFriendsByID( currentUserID , keyword );
        
       
        friendsOfCurrentUserID.forEach( (friend)=>{
            invalidUserIDs.push( friend.userId );
            invalidUserIDs.push( friend.contactId ); 
        })


        // filter duplicate ID
        invalidUserIDs = _.unionBy(invalidUserIDs);
        let validUserIDs = await userSchema.searchByInvalidUserIDsAndKeyword( invalidUserIDs , keyword );
        resolve(validUserIDs);
    });
}






/************************************************************
 * @senderID that account ID is logging in
 * @receiverID is user ID whose we wanna cancel friend request 
 * @param {*} senderID who send request to Object influenced
 * @param {*} receiverID is the Object who is influenced
 * @returns resolve cancel friend request if success
 ************************************************************/
let sendAddFriendRequest = ( senderID , receiverID )=>{
    return new Promise( async ( resolve , reject ) =>{

        let isFriend =  await contactSchema.isFriend( senderID , receiverID );
        if( isFriend ){
           return reject(false)
        }


        let informationRequest = {
            userId : senderID,
            contactId : receiverID
        }
        let friendRequest = await contactSchema.createNew(informationRequest);

        let informationNotification = {
            senderId : senderID,
            receiverId : receiverID,
            type : notificationSchema.type.friendRequest
        }
        await notificationSchema.model.createNew(informationNotification);
        return resolve(true);
    })
}
let cancelFriendRequest = ( senderID , receiverID )=>{
    return new Promise( async ( resolve , reject )=>{

        let type = notificationSchema.type.friendRequest;
        let cancelFriendRequest = await contactSchema.cancelFriendRequest( senderID , receiverID );

        // handle error
        if( cancelFriendRequest.n === 0)
        {
            return reject(false);
        }
        
        await notificationSchema.model.cancelFriendRequest( senderID , receiverID , type );
        return resolve(true); 
    });
}



module.exports = {
    searchByKeyword : searchByKeyword,
    sendAddFriendRequest : sendAddFriendRequest,
    cancelFriendRequest : cancelFriendRequest
}