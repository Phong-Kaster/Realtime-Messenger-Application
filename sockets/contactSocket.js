/************************************************************
 * socket.io don't understand what userID is.It only gets socketID
 * we must create an object combine receiverID with socket.id
 * SocketIDClientSide is the key to address the problem
 * SocketIDClientSide = {                          |   SocketIDClientSide = {
 *      senderID/receiver.contactId : array        |       '60f575f3b4039841c4e9b0f9' : [ 'hnTy_kP7vh_nYnG7AAAB','ZWlCvrXWWi-TXITwAAAD']
 * }
 * @param {*} io from socket.io library
 ************************************************************/
let sendAddFriendRequest = (io)=> {
    let SocketIDClientSide = {};
    
    io.on("connection" , (socket)=>
    {
        let senderID = socket.request.user._id;
        // does sender log in or not?
        if( SocketIDClientSide[senderID] )
        {
            SocketIDClientSide[senderID].push(socket.id);
        }
        else
        {
            SocketIDClientSide[senderID] = [socket.id];
        }
        

        /* (2) catch "cancel-friend-request" event & send 
        * back "response" event & sender who sent request
        */
        socket.on("send-add-friend-request" , (receiver)=>
        {
            let sender = 
            {
                id : socket.request.user._id,
                username : socket.request.user.username,
                avatar : socket.request.user.avatar
            }


            if(SocketIDClientSide[receiver.contactId])
            {
                SocketIDClientSide[receiver.contactId].forEach( (socketID) => {
                    // & send back who is sending request -> javascript/contactConfig.js
                    socket.broadcast.to(socketID).emit("response-send-add-friend-request",sender);
                })
            }
        });
        

        /* trigged if F5 , open new tab, close browser ,...
        * delete old socketId of sender & receiver
        */ 
        socket.on("disconnect",()=>
        {
            // delete old socketId when tabs closed
            SocketIDClientSide[senderID] = SocketIDClientSide[senderID].filter((socketId)=>{
                return socketId !== socket.id;
            })
            
            // if user shut down PC
            if( !SocketIDClientSide[senderID].length){
                delete SocketIDClientSide[senderID];
            }
        })
    });
}



/************************************************************
 * @param {*} io from socket.io library
 * ->First step : create SocketIDClientSide object . Its senderID/receiver.contact property is an array
 * This array contain socketID which is created when user logs in or open new tabs,...
 * ->Second step : check user log in or not?
 * If not then create a new socketID
 * ->Third step : catch "cancel-friend-request" event & send back "response" event & sender who sent request
 * ->Fourth step : listen "disconnect" event to delete non-essential socketID.
 * Triggered trigged if F5 , open new tab, close browser ,...
 ************************************************************/
let cancelFriendRequest = (io)=> {
    /* First step */
    let SocketIDClientSide = {};
    
    io.on("connection" , (socket)=>
    {
        /* Second step */
        let senderID = socket.request.user._id;
        if( SocketIDClientSide[senderID] )
        {
            SocketIDClientSide[senderID].push(socket.id);
        }
        else
        {
            SocketIDClientSide[senderID] = [socket.id];
        }



        /* Third step - event(2)*/
        socket.on("cancel-friend-request" , (receive)=>
        {
            let sender = { id : socket.request.user._id }

            if( SocketIDClientSide[receive.contactId] ){
                SocketIDClientSide[receive.contactId].forEach( (socketID)=>{
                    socket.broadcast.to(socketID).emit("response-cancel-friend-request" , sender);
                });
            }
        });



        /* Fourth step */
        socket.on("disconnect" , ()=>
        {
            // delete old socketId when tabs closed
            SocketIDClientSide[senderID] = SocketIDClientSide[senderID].filter((socketId)=>{
                return socketId !== socket.id;
            })
            

            // if user shut down PC
            if( !SocketIDClientSide[senderID].length){
                delete SocketIDClientSide[senderID];
            }
        });
    });
}


module.exports = {
    sendAddFriendRequest : sendAddFriendRequest,
    cancelFriendRequest : cancelFriendRequest
}