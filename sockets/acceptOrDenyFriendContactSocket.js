
let denyReceivedFriendContact = (io)=>{
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
        socket.on("deny-received-friend-contact" , (receive)=>
        {
            let sender = { id : socket.request.user._id }

            if( SocketIDClientSide[receive.contactId] ){
                SocketIDClientSide[receive.contactId].forEach( (socketID)=>{
                    socket.broadcast.to(socketID).emit("response-deny-received-friend-contact" , sender);
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
    denyReceivedFriendContact : denyReceivedFriendContact
}