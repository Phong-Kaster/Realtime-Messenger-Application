const notificationModel = require('../models/notificationModel.js');
/************************************************************
 * @param {*} req 
 * @param {*} res 
 * @returns 
 ************************************************************/
let retrieveMoreNotifications = async ( req , res )=>{
    try 
    {
        let quantitySeenNotifications = Number(req.params.quantitySeenNotifications);
        let receiverID = req.user._id;
        
        let oldNotifications = await notificationModel.retrieveMoreNotifications( receiverID , quantitySeenNotifications );
        return res.status(200).send(oldNotifications);
    } 
    catch (error) 
    {
        return res.status(500).send(error);
    }
}



/************************************************************
 * @param {*} req 
 * @param {*} res 
 * @returns 
 ************************************************************/
let markAsRead = async ( req , res)=>{
    let receiverID = req.user._id;
    let senderIDs = req.body.senderIDs;
    try 
    {
        let outcome = await notificationModel.markAsRead( receiverID , senderIDs );
        return res.status(200).send(outcome);
    } 
    catch (error) 
    {
        return res.status(500).send(error);
    }
}



module.exports = {
    retrieveMoreNotifications : retrieveMoreNotifications,
    markAsRead : markAsRead
}