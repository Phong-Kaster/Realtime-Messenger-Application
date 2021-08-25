const chatGroupSchema = require('../schema/chatGroupSchema.js');
const contactSchema = require('../schema/contactSchema.js');
const userSchema = require('../schema/userSchema.js');
const messengerSchema = require('../schema/messengerSchema.js');
const _ = require('lodash');
import {systemError, userError} from '../notification/english.js';
const fsExtra = require('fs-extra');

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
                    element.messenger = _.reverse(content);
                }
                else
                {
                    let content = await messengerSchema.model.retrieveIndividualContentMessenger(userID, element._id);
                    element.messenger = _.reverse(content);
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



/********************************************************
 * @param {*} sender | object | contain information about sender
 * @param {*} receiverID | string | who receive message from @sender
 * @param {*} content | string | what sender wanna say to @receiverID
 * @param {*} sendToGroup | boolean | is a message for individual or group ?
 ********************************************************/
let sendMessage = ( sender , receiverID , content , sendToGroup )=>{
    return new Promise ( async ( resolve, reject )=>{

        if( !sender || !receiverID || !content ){
            reject(false);
        }

        try
        {
            if( sendToGroup == "true" ){
                
                let group = await chatGroupSchema.findByIdentification(receiverID);
                if( !group ){
                    reject(systemError.inexistentGroup);
                }
                
                let receiver = {
                    id: group._id,
                    name: group.name,
                    avatar: "groupChat.png"
                }
                let information = {
                    senderId : sender.id,
                    receiverId : receiverID,
                    typeConversation : messengerSchema.typeConversation.group,
                    typeMessenger : messengerSchema.typeMessenger.text,
                    sender: sender,
                    receiver : receiver,
                    content : content, // messenger's content
                    createdAt : Date.now()
                }

                let message = await messengerSchema.model.createNew(information);
                await chatGroupSchema.getTheLatestMessage(group._id, group.messageAmount + 1 );
                resolve(message);
            }
            else
            {
                let user = await userSchema.findByIdentificationAndRetrieveSpecificFields(receiverID);
                if( !user ){
                    reject(userError.inexistentAccount);
                }


                let receiver = {
                    id: user._id,
                    name: user.username,
                    avatar: user.avatar
                }

                let information = {
                    senderId : sender.id,
                    receiverId : receiverID,
                    typeConversation : messengerSchema.typeConversation.individual,
                    typeMessenger : messengerSchema.typeMessenger.text,
                    sender: sender,
                    receiver : receiver,
                    content : content, // messenger's content
                    createdAt : Date.now()
                }
                let message = await messengerSchema.model.createNew(information);
                await contactSchema.updateStatusConversation( sender.id, receiver.id );
                resolve(message);
            }
        } 
        catch (error) 
        {
            console.log(error);
            reject(error);
        }
    });
}



/********************************************************
 * @param {*} sender | object | contain information about sender
 * @param {*} receiverID | string | who receive message from @sender
 * @param {*} photo | string | what sender wanna say to @receiverID
 * @param {*} sendToGroup | boolean | is a message for individual or group ?
 ********************************************************/
let sendPhotoMessage = ( sender , receiverID , photo , sendToGroup )=>{
    return new Promise ( async ( resolve, reject )=>{
        let photoBuffer = await fsExtra.readFile(photo.path);
        let photoType = photo.mimetype;
        let photoName = photo.originalname;

        if( !sender || !receiverID || !photo ){
            reject(false);
        }

        try
        {
            if( sendToGroup == "true" ){
                let group = await chatGroupSchema.findByIdentification(receiverID);
                if( !group ){
                    reject(systemError.inexistentGroup);
                }
                
                let receiver = {
                    id: group._id,
                    name: group.name,
                    avatar: "groupChat.png"
                }

                let information = {
                    senderId : sender.id,
                    receiverId : receiverID,
                    typeConversation : messengerSchema.typeConversation.group,
                    typeMessenger : messengerSchema.typeMessenger.photo,
                    sender: sender,
                    receiver : receiver,
                    file :
                        {
                            data : photoBuffer,
                            fileType : photoType,
                            fileName : photoName
                        }, // messenger's photo
                    createdAt : Date.now()
                }

                let message = await messengerSchema.model.createNew(information);
                await chatGroupSchema.getTheLatestMessage(group._id, group.messageAmount + 1 );
                resolve(message);
            }
            else
            {
                

                let user = await userSchema.findByIdentificationAndRetrieveSpecificFields(receiverID);
                if( !user ){
                    reject(userError.inexistentAccount);
                }


                let receiver = {
                    id: user._id,
                    name: user.username,
                    avatar: user.avatar
                }

                

                let information = {
                    senderId : sender.id,
                    receiverId : receiverID,
                    typeConversation : messengerSchema.typeConversation.individual,
                    typeMessenger : messengerSchema.typeMessenger.photo,
                    sender: sender,
                    receiver : receiver,
                    file :
                        {
                            data : photoBuffer,
                            fileType : photoType,
                            fileName : photoName
                        }, // messenger's photo
                    createdAt : Date.now()
                }

                let message = await messengerSchema.model.createNew(information);
                await contactSchema.updateStatusConversation( sender.id, receiver.id );
                resolve(message);
            }
        } 
        catch (error) 
        {
            console.log(error);
            reject(error);
        }
    });
}



let sendDocumentMessage = ( sender , receiverID , document , sendToGroup )=>{
    return new Promise ( async ( resolve, reject )=>{
        let documentBuffer = await fsExtra.readFile(document.path);
        let documentType = document.mimetype;
        let documentName = document.originalname;

        if( !sender || !receiverID || !document ){
            reject(false);
        }

        try
        {
            if( sendToGroup == "true" ){
                let group = await chatGroupSchema.findByIdentification(receiverID);
                if( !group ){
                    reject(systemError.inexistentGroup);
                }
                
                let receiver = {
                    id: group._id,
                    name: group.name,
                    avatar: "groupChat.png"
                }

                let information = {
                    senderId : sender.id,
                    receiverId : receiverID,
                    typeConversation : messengerSchema.typeConversation.group,
                    typeMessenger : messengerSchema.typeMessenger.document,
                    sender: sender,
                    receiver : receiver,
                    file :
                        {
                            data : documentBuffer,
                            fileType : documentType,
                            fileName : documentName
                        }, // messenger's document
                    createdAt : Date.now()
                }

                let message = await messengerSchema.model.createNew(information);
                await chatGroupSchema.getTheLatestMessage(group._id, group.messageAmount + 1 );
                resolve(message);
            }
            else
            {
                

                let user = await userSchema.findByIdentificationAndRetrieveSpecificFields(receiverID);
                if( !user ){
                    reject(userError.inexistentAccount);
                }


                let receiver = {
                    id: user._id,
                    name: user.username,
                    avatar: user.avatar
                }

                

                let information = {
                    senderId : sender.id,
                    receiverId : receiverID,
                    typeConversation : messengerSchema.typeConversation.individual,
                    typeMessenger : messengerSchema.typeMessenger.document,
                    sender: sender,
                    receiver : receiver,
                    file :
                        {
                            data : documentBuffer,
                            fileType : documentType,
                            fileName : documentName
                        }, // messenger's document
                    createdAt : Date.now()
                }

                let message = await messengerSchema.model.createNew(information);
                await contactSchema.updateStatusConversation( sender.id, receiver.id );
                resolve(message);
            }
        } 
        catch (error) 
        {
            console.log(error);
            reject(error);
        }
    });
}


/********************************************************
 * @param {*} userID | string | who is logging in
 * @param {*} quantityIndividualTab | number | quantity of individual conversation which appears in the screen
 * @param {*} quantityGroupTab | number | quantity of group conversation which appears in the screen
 * 
 * Step 1 : check input data
 * Step 2 : retrieve friends who does not appear in left tab of screen
 * Step 3 : retrieve necessary information from Step 2  & attach updateTime
 * Step 4 : retrieve group chat that user is a member
 * Step 5 : merge friends & group to @allUnseenConversation & sort by updatedTime
 * Step 6 : retrieve messages between user & friends(or Group)
 * Step 7 : sort by updated Time again & finish
 * @returns conversation | object | information about unseen conversation
 ********************************************************/
let readMoreConversationAllChat = ( userID , quantityIndividualTab , quantityGroupTab )=>{
    return new Promise( async ( resolve , reject)=>{
        /* Step 1 */
        if( !userID || !quantityIndividualTab || !quantityGroupTab)
        {
            reject(false);
        }

        try 
        {
            /* Step 2 */
            let result = await contactSchema.retrieveMoreFriendContact( userID , quantityIndividualTab );
            /* Step 3 */
            let unseenFriends = result.map( async (element)=>{
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
            
            let unseenIndividualConversation = await Promise.all(unseenFriends);
            /* Step 4 */
            let unseenGroupConversation = await chatGroupSchema.readMoreChatGroup( userID , quantityGroupTab );
            /* Step 5 */
            let allUnseenConversation = unseenIndividualConversation.concat(unseenGroupConversation);
                allUnseenConversation = _.sortBy(allUnseenConversation ,(element)=>{
                    return -element.updatedAt;
                });
            /* Step 6 */
            let allUnseenContentConversation = allUnseenConversation.map( async (element)=>{
                element = element.toObject();
                if( element.member )
                {
                    let content = await messengerSchema.model.retrieveGroupContentMessenger(element._id);
                    element.messenger = _.reverse(content);
                }
                else
                {
                    let content = await messengerSchema.model.retrieveIndividualContentMessenger(userID, element._id);
                    element.messenger = _.reverse(content);
                }
                return element;
            });
            /* Step 7 */         
            allUnseenContentConversation = await Promise.all(allUnseenContentConversation);
            allUnseenContentConversation = _.sortBy(allUnseenContentConversation,(element)=>{
                return -element.updatedAt;
            });

            resolve(allUnseenContentConversation);
        } 
        catch (error) 
        {
            reject(error);
        }
    });
}



module.exports = {
    retrieveConversation : retrieveConversation,
    sendMessage : sendMessage,
    sendPhotoMessage : sendPhotoMessage,
    sendDocumentMessage : sendDocumentMessage,
    readMoreConversationAllChat : readMoreConversationAllChat
}