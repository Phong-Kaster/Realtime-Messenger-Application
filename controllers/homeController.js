/* ======================= LIBRARY ======================= */
const notificationModel = require('../models/notificationModel.js');
/* ======================= FUNCTION ======================= */
let home = async (req,res) =>{
    let notifications = await notificationModel.retrieveNotifications(req.user._id);
    

    return res.render("./home/section/content.ejs", {
        success : req.flash("success"),
        errors : req.flash("errors"),
        user : req.user,
        notifications : notifications,
        nothing : ""
    });
};

module.exports = {
    home : home
};