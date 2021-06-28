let home = (req,res) =>{
    return res.render("home");
};

let groupChat = (req,res)=>{
    res.send("This is group chat");
}
module.exports = {
    home : home,
    groupChat : groupChat
};