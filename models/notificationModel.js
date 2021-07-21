/* ======================= LIBRARY ======================= */
const { reject } = require('lodash');
const notificationSchema = require('../schema/notificationSchema.js');
const userSchema = require('../schema/userSchema.js');
/* ======================= FUNCTION ======================= */
/**
 * 
 * @param {*} receiverID 
 * @returns 
 */
let retrieveNotifications = ( receiverID )=>{
    return new Promise ( async ( resolve, reject )=>{
        try
        {
            let notifications = await notificationSchema.model.retrieveNotification(receiverID);
            let contentOfNotifications = notifications.map( async (element)=>{

                let sender = await userSchema.findByIdentification(element.senderId);
               
                return notificationSchema.notificationTemplate( sender , element.type , element.isRead );
            });
            resolve(notifications);
        }
        catch(error)
        {
           reject(error);
        }
    })
}


module.exports = {
    retrieveNotifications : retrieveNotifications
}