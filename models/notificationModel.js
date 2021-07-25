/* ======================= LIBRARY ======================= */
const { reject } = require('lodash');
const notificationSchema = require('../schema/notificationSchema.js');
const userSchema = require('../schema/userSchema.js');

/************************** FUNCTION ***************************/
/*************************************************************
 * @param {*} receiverID is user whose account is logging in
 * @notifications are content relate to user logging now
 * @contentOfNotifications are template for notification retrieved
 * @returns contentOfNotifications
 *************************************************************/
let retrieveNotifications = ( receiverID )=>{
    return new Promise ( async ( resolve, reject )=>{
        try
        {
            let notifications = await notificationSchema.model.retrieveNotification(receiverID);
            let contentOfNotifications = notifications.map( async (element)=>{

                let sender = await userSchema.findByIdentification(element.senderId);
               
                return notificationSchema.notificationTemplate( sender , element.type , element.isRead );
            });
            resolve( await Promise.all(contentOfNotifications) );
        }
        catch(error)
        {
           reject(error);
        }
    })
}



/*************************************************************
 * @param {*} receiverID 
 * @returns 
 *************************************************************/
let countUnreadNotifications = ( receiverID )=>{
    return new Promise ( async ( resolve, reject )=>{
        try
        {
           let quantityOfUnreadNotification = await notificationSchema.model.countUnreadNotification(receiverID);
           resolve(quantityOfUnreadNotification);
        }
        catch(error)
        {
           reject(error);
        }
    })
}



/*************************************************************
 * @param {*} receiverID 
 * @returns more notifications when click "load more notifications"
 *************************************************************/
let retrieveMoreNotifications = ( receiverID , quantitySeenNotifications )=>{
    return new Promise ( async ( resolve, reject )=>{
        try
        {
            let oldNotification = await notificationSchema.model.retrieveMoreNotification( receiverID , quantitySeenNotifications );
            let contentOfNotifications = oldNotification.map( async (element)=>{

                let sender = await userSchema.findByIdentification(element.senderId);
               
                return notificationSchema.notificationTemplate( sender , element.type , element.isRead );
            });
            
            resolve( await Promise.all(contentOfNotifications) );
        }
        catch(error)
        {
           reject(error);
        }
    })
}



/*************************************************************
 * @param {*} receiverID who receive notifications
 * @param {*} senderIDs is array include Sender's ID
 * @returns mark unseen notifications as read 
 *************************************************************/
let markAsRead = ( receiverID , senderIDs)=>{
    return new Promise( async ( resolve , reject )=>{
        try
        {
            await notificationSchema.model.markAsRead( receiverID , senderIDs );
            resolve(true);
        } 
        catch (error) 
        {
            console.log("Error mark as read");
            console.log(error);
            reject(false); 
        }
    });
}



module.exports = {
    retrieveNotifications : retrieveNotifications,
    countUnreadNotifications : countUnreadNotifications,
    retrieveMoreNotifications : retrieveMoreNotifications,
    markAsRead : markAsRead
}