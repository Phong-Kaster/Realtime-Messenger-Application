/* ======================= LIBRARY ======================= */
const contactSchema = require('../schema/contactSchema.js');
const userSchema = require('../schema/userSchema.js');
const _ = require('lodash');
/* ======================= FUNCTION ======================= */

/**
 * @param {*} currentUserID that account ID is logging in
 * @param {*} keyword that is condition we input to search
 * @invalidUserIDs is an array that contains User IDs who are our friends
 * @friendsOfCurrentUserID is an array that is result from query searchFriendsByID
 * @validUserIDs is an array that include User IDs who are not our friends
 * @returns validUserIDs
 */
let searchByKeyword = ( currentUserID , keyword )=>{
    return new Promise( async ( resolve , reject )=>{

        let invalidUserIDs = [];
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



module.exports = {
    searchByKeyword : searchByKeyword
}