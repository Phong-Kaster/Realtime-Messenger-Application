/* ======================= LIBRARY ======================= */
const contactSchema = require('../schema/contactSchema.js');
const userSchema = require('../schema/userSchema.js');
const _ = require('lodash');
/* ======================= FUNCTION ======================= */

let searchByKeyword = ( currentUserID , keyword )=>{
    return new Promise( async ( resolve , reject )=>{

        // deprecate User ID contains ID that isn't used to search new user
        let invalidUserIDs = [];
        // friends Of Current User Id contains ID that is friend of current User Id
        let friendsOfCurrentUserID = await contactSchema.searchFriendsByID( currentUserID , keyword );
        
       
        friendsOfCurrentUserID.forEach( (friend)=>{
            invalidUserIDs.push( friend.userId );
            invalidUserIDs.push( friend.contactId ); 
        })


        // filter duplicate ID
        invalidUserIDs = _.unionBy(invalidUserIDs);



        // returns validUserIDs include user that they aren't friend with current User ID
        let validUserIDs = await userSchema.searchByInvalidUserIDsAndKeyword( invalidUserIDs , keyword );
        resolve(validUserIDs);
    });
}



module.exports = {
    searchByKeyword : searchByKeyword
}