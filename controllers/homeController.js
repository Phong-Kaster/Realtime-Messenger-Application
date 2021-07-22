/* ======================= LIBRARY ======================= */
const notificationModel = require('../models/notificationModel.js');
/* ======================= FUNCTION ======================= */




/*************************************************************
 * @notifications | array |
 * @quantityOfUnreadNotification | number |
 * @param {*} req 
 * @param {*} res 
 * @returns 
 *************************************************************/
let home = async (req,res) =>{
    
    let notifications = await notificationModel.retrieveNotifications(req.user._id);
    let quantityOfUnreadNotification = await notificationModel.countUnreadNotifications(req.user._id);
    
    return res.render("./home/section/content.ejs", {
        success : req.flash("success"),
        errors : req.flash("errors"),
        user : req.user,
        notifications : notifications,
        quantityOfUnreadNotification : quantityOfUnreadNotification
    });
};

module.exports = {
    home : home
};