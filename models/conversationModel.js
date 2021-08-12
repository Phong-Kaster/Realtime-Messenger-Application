const chatGroupSchema = require('../schema/chatGroupSchema.js');
const contactSchema = require('../schema/contactSchema.js');
const userSchema = require('../schema/userSchema.js');
const messengerSchema = require('../schema/messengerSchema.js');
const _ = require('lodash');



/********************************************************
 * @param {*} userID | string | who is logging in
 * @param {*} contacts | object | are friend of @userID
 * @personalConversation | object | contains friend information contacts
 * @groupConversation | object | contains group conversation
 * @allConversation | object | @personalConversation + @groupConversation | is used for contentLeft.ejs
 * @allContentConversation | object | like @allConversation but it have "messenger" field | is used for contentRight.ejs
 * @returns personal conversation & group conversation
 * Step 1 : retrieve friend contacts & their information
 * Step 2 : retrieve group conversation
 * Step 3 : sort all conversation by "updatedAt" field
 * Step 4 : retrieve content of all conversation
 * Step 5 : sort all content conversation by "updatedAt". from old to new
 * Step 6 : return all results
 ********************************************************/
let retrieveConversation = ( userID )=>{
    return new Promise( async ( resolve , reject )=>{
        try 
        {
            /* Step 1 */
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

            /* Step 2 */
            let groupConversation = await chatGroupSchema.retrieveGroupConversation(userID);

            /* Step 3 */
            let allConversation = personalConversation.concat(groupConversation);
            allConversation = _.sortBy( allConversation , (element)=>{
                return -element.updatedAt;
            });

            /* Step 4 */
            let allContentConversation = allConversation.map( async (element)=>{
                element = element.toObject();
                if( element.member )
                {
                    let content = await messengerSchema.model.retrieveGroupContentMessenger(element._id);
                    element.messenger = content;
                }
                else
                {
                    let content = await messengerSchema.model.retrieveIndividualContentMessenger(userID, element._id);
                    element.messenger = content;
                }
                return element;
            });
            /* Step 5 */
            allContentConversation = await Promise.all(allContentConversation);
            allContentConversation = _.sortBy(allContentConversation,(element)=>{
                return -element.updatedAt;
            });

            /* Step 6 */
            resolve(allContentConversation);
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