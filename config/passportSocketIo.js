const passportSocketIo = require("passport.socketio");
/**************************************************************
 * onAuthorizeSuccess for successful connection to socket.io
 * onAuthorizeFail for fail connection to socket.io
 * @param {*} data that socket listened & got
 * @param {*} accept that how server response client
 * @returns 
 ************************************************************/
let onAuthorizeSuccess = ( data , accept )=>{

  if( !data.user.logged_in )
  {
      return accept( "Invalid user" , false);
  }

  console.log("->Successful connection to socket.io");
  return  accept( null , true);
}
let onAuthorizeFail = ( data , message , error , accept)=>{
  if(error)
  {
      console.log( "->Fail connection to socket.io :" , message);
      return accept( new Error(message) , false );
  }
}



/************************************************************
 * configure passport socket.io to retrieve user information from socket.io connection
 * @param {*} io that socket.io library
 * @param {*} cookieParser indicates the same name library
 * @param {*} sessionStore tell server where to store session
 ************************************************************/
let passportSocketIoConfigure = ( io , cookieParser , sessionStore )=>{
  io.use(passportSocketIo.authorize({
    cookieParser : cookieParser,       
    key : process.env.SESSION_KEY,       // the name of the cookie where express/connect stores its session_id
    secret : process.env.SESSION_SECRET,    // the session_secret to parse the cookie
    store : sessionStore,
    success : onAuthorizeSuccess,
    fail : onAuthorizeFail,
  }));
}



module.exports = passportSocketIoConfigure;