const chatGroupSchema = require('../schema/chatGroupSchema.js');
const contactSchema = require('../schema/contactSchema.js');
const userSchema = require('../schema/userSchema.js');
const _ = require('lodash');
/********************************************************
 * @param {*} userID | string | who is logging in
 * @param {*} contacts | object | are friend of @userID
 * @returns personal conversation & group conversation
 ********************************************************/
let retrieveConversation = ( userID )=>{
    return new Promise( async ( resolve , reject )=>{
        try 
        {
            let result = await contactSchema.retrieveFriendContact( userID );
            let contacts = result.map( async (element)=>{
                if( element.contactId == userID)
                {
                    let user = await userSchema.findByIdentificationAndRetrieveSpecificFields( element.userId );
                    user.updatedAt = element.updatedAt;
                    return user;
                }
                else
                {
                    let user = await userSchema.findByIdentificationAndRetrieveSpecificFields( element.contactId );
                    user.updatedAt = element.updatedAt;
                    return user;
                }
            });


            let personalConversation = await Promise.all(contacts);
            let groupConversation = await chatGroupSchema.retrieveGroupConversation(userID);
            let allConversation = personalConversation.concat(groupConversation);

            
            allConversation = _.sortBy( allConversation , (element)=>{
                return -element.updatedAt;
            });


            resolve({
                allConversation : allConversation,
                personalConversation : personalConversation,
                groupConversation : groupConversation
            });
        } 
        catch (error) 
        {
            reject(error);
        }
    });
}

module.exports = {
    retrieveConversation : retrieveConversation
}