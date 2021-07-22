const notificationModel = require('../models/notificationModel.js');
/************************************************************
 * 
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

module.exports = {
    retrieveMoreNotifications : retrieveMoreNotifications
}