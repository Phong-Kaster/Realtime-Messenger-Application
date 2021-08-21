const groupChatSchema = require('../schema/chatGroupSchema.js');
const _ = require("lodash");
const chatGroupSchema = require('../schema/chatGroupSchema.js');


/***************************************************************
 * @param {*} userID | string | is user logging in
 * @param {*} friendIDs | array | contains other IDs whom is member of group chat
 * @param {*} groupChatName | string | is the name of group
 ***************************************************************/
let createGroupChat = ( userID , friendIDs , groupChatName )=>{
    return new Promise( async ( resolve , reject)=>{
        try 
        {
            friendIDs.unshift( {userId: `${userID}` });
            friendIDs = _.uniqBy(friendIDs , "userId");

            let information = {
                name : groupChatName,
                userAmount : friendIDs.length,
                messageAmount : 0,
                userId : userID, // host of group
                member : friendIDs
            }

            let group = await chatGroupSchema.createNew(information);
            resolve(group);
        } 
        catch (error) 
        {
            reject(error);
        }
    });
}

module.exports = {
    createGroupChat : createGroupChat
}