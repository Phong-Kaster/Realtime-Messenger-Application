/* ======================= LIBRARY ======================= */
const contactSchema = require('../schema/contactSchema.js');
const userSchema = require('../schema/userSchema.js');
const notificationSchema = require('../schema/notificationSchema.js');
const _ = require('lodash');
const { reject } = require('lodash');



/************************************************************
 * @param {*} userID that account is logging in
 * @param {*} keyword that is condition we input to search
 * @invalidUserIDs is an array that contains User IDs who are our friends
 * @friendsOfUserID is an array that is result from query searchFriendsByID
 * @validUserIDs is an array that include User IDs who are not our friends
 * @returns validUserIDs
 ************************************************************/
let searchByKeyword = ( userID , keyword )=>{
    return new Promise( async ( resolve , reject )=>{

        let invalidUserIDs = [userID];
        let friendsOfUserID = await contactSchema.searchFriendsByID( userID , keyword );
        
       
        friendsOfUserID.forEach( (friend)=>{
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
 * @receiverID is user ID whose @senderID wanna send friend request 
 * @type is the type of notification which is sent to @receiverID
 * @returns create a contact record with its status is false
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



/************************************************************
 * @senderID that account ID is logging in
 * @receiverID is user ID whose @senderID wanna cancel friend request 
 * @type is the type of notification which is sent to @receiverID
 * @returns delete a contact record with its status is false
 ************************************************************/
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



/************************************************************
 * @param {*} userID | string | who is logging in
 * @returns people that are friends of @userID
 ************************************************************/
 let retrieveFriendContact = (userID)=>{
    return new Promise( async ( resolve , reject )=>{
        try 
        {
            let result = await contactSchema.retrieveFriendContact( userID );
            let contacts = result.map( async (element)=>{
                if( element.contactId == userID)
                {
                    return await userSchema.findByIdentificationAndRetrieveSpecificFields( element.userId );
                }
                else
                {
                    return await userSchema.findByIdentificationAndRetrieveSpecificFields( element.contactId );
                }
                
            });

            resolve(await Promise.all(contacts) );
        }
        catch (error) 
        {
            reject(error);
        }
    });
}



/************************************************************
 * @param {*} userID | string | who is logging in
 * @returns people that are friends of @userID
 ************************************************************/
let retrieveSentFriendContact = ( userID )=>{
    return new Promise( async ( resolve , reject )=>{
        try 
        {
            let result = await contactSchema.retrieveSentFriendContact( userID );
            let contacts = result.map( async (element)=>{
                return await userSchema.findByIdentificationAndRetrieveSpecificFields( element.contactId );
            });

            resolve(await Promise.all(contacts) );
        }
        catch (error) 
        {
            reject(error);
        }
    });
}



/************************************************************
 * @param {*} userID | string | who is logging in
 * @returns people that are friends of @userID
 ************************************************************/
let retrieveReceivedFriendContact = (userID)=>{
    return new Promise( async ( resolve , reject )=>{
        try 
        {
            let result = await contactSchema.retrieveReceivedFriendContact( userID );
            let contacts = result.map( async (element)=>{
                return await userSchema.findByIdentificationAndRetrieveSpecificFields( element.userId );
            });

            resolve(await Promise.all(contacts) );
        }
        catch (error) 
        {
            reject(error);
        }
    });
}



/************************************************************
 * @param {*} userID | string | who is logging in
 * @totalContact | number | how many documents are counted that matched with this condition
 * @returns number of friend contacts belong to who has this @userID
 ************************************************************/
let countFriendContact = (userID)=>{
    return new Promise( async ( resolve , reject )=>{
        try 
        {
            let totalContact = await contactSchema.countFriendContact(userID);
            resolve(totalContact);
        }
        catch (error) 
        {
            reject(error);
        }
    });
}



/************************************************************
 * @param {*} userID | string | who is logging in
 * @totalContact | number | how many documents are counted that matched with this condition
 * @returns number of people contacts whom @userID sent friend request & is waiting for response
 ************************************************************/
let countSentFriendContact = (userID)=>{
    return new Promise( async ( resolve , reject )=>{
        try 
        {
            let totalContact = await contactSchema.countSentFriendContact(userID);
            resolve(totalContact);
        }
        catch (error) 
        {
            reject(error);
        }
    });
}



/************************************************************
 * @param {*} userID | string | who is logging in
 * @totalContact | number | how many documents are counted that matched with this condition
 * @returns |number| number of people contacts who sent friend request to @userID
 ************************************************************/
let countReceivedFriendContact = (userID)=>{
    return new Promise( async ( resolve , reject )=>{
        try 
        {
            let totalContact = await contactSchema.countReceivedFriendContact(userID);
            resolve(totalContact);
        }
        catch (error) 
        {
            reject(error);
        }
    });
}



/************************************************************
 * @param {*} userID | string | who is logging in
 * @param {*} quantitySeenFriendContacts
 * each @element in @result will be used to find user
 * @returns | object | older friends of @userID
 ************************************************************/
let retrieveMoreFriendContact = ( userID , quantitySeenFriendContacts)=>{
    return new Promise( async ( resolve , reject)=>{
        try 
        {
            let result = await contactSchema.retrieveMoreFriendContact( userID , quantitySeenFriendContacts );
            let contacts = result.map( async (element)=>{
                if( element.contactId == userID)
                {
                    return await userSchema.findByIdentificationAndRetrieveSpecificFields( element.userId );
                }
                else
                {
                    return await userSchema.findByIdentificationAndRetrieveSpecificFields( element.contactId );
                }
                
            });
            resolve(await Promise.all(contacts) );
        } 
        catch (error) 
        {
            reject(error);
        }
    });
}



/************************************************************
 * @param {*} userID | string | who is logging in
 * @param {*} quantitySeenSentFriendRequestContacts | number | number of people whom user sent friend request
 * @returns people are sent friend request by user but they does not appear
 ************************************************************/
let retrieveMoreSentFriendContact = ( userID , quantitySeenSentFriendRequestContacts)=>{
    return new Promise( async ( resolve , reject)=>{
        try 
        {
            let result = await contactSchema.retrieveMoreSentFriendContact( userID , quantitySeenSentFriendRequestContacts );
            let contacts = result.map( async (element)=>{
                return await userSchema.findByIdentificationAndRetrieveSpecificFields( element.contactId );
            });
            resolve(await Promise.all(contacts) );
        } 
        catch (error) 
        {
            reject(error);
        }
    });
}



/************************************************************
 * @param {*} userID | string | who is logging in
 * @param {*} quantitySeenReceivedFriendContacts | number | number of people sending friend request & appearing in the screen
 * @returns people sending friend request but they does not appear
 ************************************************************/
let retrieveMoreReceivedFriendContact = ( userID , quantitySeenReceivedFriendContacts)=>{
    return new Promise( async ( resolve , reject)=>{
        try 
        {
            let result = await contactSchema.retrieveMoreReceivedFriendContact( userID , quantitySeenReceivedFriendContacts );
            let contacts = result.map( async (element)=>{
                return await userSchema.findByIdentificationAndRetrieveSpecificFields( element.userId );
            });

            resolve(await Promise.all(contacts));
        } 
        catch (error) 
        {
            reject(error);
        }
    });
}



/*************************************************************
 * views/home/section/contact.ejs - line 140
 * @param {*} userID | string | who is logging in , send unfriend request
 * @param {*} senderID | string | who send friend request to @userID & is refused request
 * @returns delete a new contact record
 *************************************************************/
let denyReceivedFriendContact = ( userID , senderID )=>{
    return new Promise( async (resolve , reject)=>{
        let status = contactSchema.denyReceivedFriendContact( userID , senderID );
        if( status.n === 0)
        {
            return reject(false);
        }

        await notificationSchema.model.deleteReceivedFriendContactNotification( userID , senderID);
        resolve(true);
    })
}



/*************************************************************
 * views/home/section/contact.ejs - line 137
 * @param {*} userID | string | who is logging in , send unfriend request
 * @param {*} senderID | string | who send friend request to @userID & is accepted request
 * @returns create a new contact record
 *************************************************************/
let acceptReceivedFriendContact = ( userID , senderID)=>{
    return new Promise( async (resolve , reject)=>{
        let status = contactSchema.acceptReceivedFriendContact( userID , senderID );
        if( status.nModified === 0)
        {
            return reject(false);
        }
        
        let informationNotification = {
            senderId : userID,
            receiverId : senderID,
            type : notificationSchema.type.acceptFriendRequest
        }
        await notificationSchema.model.createNew(informationNotification);
        resolve(true);
    })
}



/*************************************************************
 * @param {*} userID | string | who is logging in , send unfriend request
 * @param {*} receiverID | string | whom @userID wanna unfriend
 * views/home/section/contact.ejs - line 75
 * @returns delete a contact record and its status is true
 *************************************************************/
let unfriend = ( userID , receiverID)=>{
    return new Promise( async (resolve , reject)=>{
        let status = contactSchema.unfriend( userID , receiverID );
        if( status.nModified === 0)
        {
            return reject(false);
        }
        resolve(true);
    })
}



module.exports = {
    searchByKeyword : searchByKeyword,
    sendAddFriendRequest : sendAddFriendRequest,
    cancelFriendRequest : cancelFriendRequest,

    retrieveSentFriendContact : retrieveSentFriendContact,
    retrieveReceivedFriendContact : retrieveReceivedFriendContact,
    retrieveFriendContact : retrieveFriendContact,

    countFriendContact : countFriendContact,
    countSentFriendContact : countSentFriendContact,
    countReceivedFriendContact : countReceivedFriendContact,

    retrieveMoreFriendContacts : retrieveMoreFriendContact,
    retrieveMoreSentFriendContact : retrieveMoreSentFriendContact,
    retrieveMoreReceivedFriendContact : retrieveMoreReceivedFriendContact,

    denyReceivedFriendContact : denyReceivedFriendContact,
    acceptReceivedFriendContact : acceptReceivedFriendContact,
    unfriend : unfriend
}