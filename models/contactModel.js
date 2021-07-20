/* ======================= LIBRARY ======================= */
const contactSchema = require('../schema/contactSchema.js');
const userSchema = require('../schema/userSchema.js');
const _ = require('lodash');
const { reject } = require('lodash');
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



let sendAddFriendRequest = ( currentUserID , targetID )=>{
    return new Promise( async ( resolve , reject ) =>{

        let isFriend =  await contactSchema.isFriend( currentUserID , targetID );
        if( isFriend ){
           return reject(false)
        }


        let informationRequest = {
            userId : currentUserID,
            contactId : targetID
        }


        let friendRequest = await contactSchema.createNew(informationRequest);
        return resolve(friendRequest);
    })
}


/************************************************************
 * @currentUserID that account ID is logging in
 * @targetID is user ID whose we wanna cancel friend request 
 * @param {*} currentUserID 
 * @param {*} targetID 
 * @returns resolve cancel friend request if success
 ************************************************************/
let cancelFriendRequest = ( currentUserID , targetID )=>{
    return new Promise( async ( resolve , reject )=>{

        let cancelFriendRequest = await contactSchema.cancelFriendRequest( currentUserID , targetID );
        // handle error
        if( cancelFriendRequest.n === 0)
        {
            return reject(false);
        }

        return resolve(cancelFriendRequest); 
    });
}



module.exports = {
    searchByKeyword : searchByKeyword,
    sendAddFriendRequest : sendAddFriendRequest,
    cancelFriendRequest : cancelFriendRequest
}