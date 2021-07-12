let home = (req,res) =>{
    return res.render("./home/section/content.ejs", {
        success : req.flash("success"),
        errors : req.flash("errors"),
        user : req.user
    });
};

let groupChat = (req,res)=>{
    res.send("This is group chat");
}
module.exports = {
    home : home,
    groupChat : groupChat
};