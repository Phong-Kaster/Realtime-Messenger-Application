let home = (req,res) =>{
    return res.render("./home/section/content.ejs");
};

let groupChat = (req,res)=>{
    res.send("This is group chat");
}
module.exports = {
    home : home,
    groupChat : groupChat
};