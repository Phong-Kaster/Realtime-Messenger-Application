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
 * Step 5 : sort all content conversation by "updatedAt"
 * Step 6 : retrieve content of messenger between sender and receiver
 * Step 7 : resolve all results
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
                let content = await messengerSchema.model.retrieveContentMessenger(userID, element._id);
                element = element.toObject();
                element.messenger = content;
                return element;
            });
            /* Step 5 */
            allContentConversation = await Promise.all(allContentConversation);
            allContentConversation = _.sortBy(allContentConversation,(element)=>{
                return -element.updatedAt;
            });

            /* Step 7 */
            resolve({
                allConversation : allConversation,
                allContentConversation : allContentConversation,
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