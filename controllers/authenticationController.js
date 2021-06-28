let login = (req,res) =>{
    return res.render("login");
};

let logout = (req,res) =>{
    res.send("this is log out function")
}
module.exports = {
    login : login,
    logout : logout
};