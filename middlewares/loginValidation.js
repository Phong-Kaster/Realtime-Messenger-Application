/*******************************************************
 * If user is not already logged in, then redirect to rooms page
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns redirect
 ********************************************************/
let isLogout = (req,res,next) =>{
    
    if( !req.isAuthenticated() )
    {
        return res.redirect("/");
    }
    next();
}


/*******************************************************
 * If user is already logged in, then redirect to rooms page
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns redirect
 ********************************************************/
let isLogin = (req,res,next) =>{
    if( req.isAuthenticated() )
    {
        return res.redirect("/home");
    }
    next();
}


module.exports = {
    isLogout : isLogout,
    isLogin : isLogin
}