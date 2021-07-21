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
        

        //(2) listen event "send add friend request" 
        socket.on("send-add-friend-request" , (receiver)=>{
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
        

        //trigged if F5 , open new tab, close browser ,...
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

let cancelFriendRequest = (io)=> {
    io.on("connection" , (socket)=>{
        socket.on("cancel-friend-request" , (data)=>{
            console.log(data);
        });
    });
}


module.exports = {
    sendAddFriendRequest : sendAddFriendRequest,
    cancelFriendRequest : cancelFriendRequest
}