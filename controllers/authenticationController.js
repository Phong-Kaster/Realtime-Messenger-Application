let login = (req,res) =>{
    return res.render("./authentication/authentication.ejs");
};

let logout = (req,res) =>{
    res.send("this is log out function")
}
module.exports = {
    login : login,
    logout : logout
};