
let acceptReceivedFriendContact = (io)=>{
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
        

        /* (2) catch "send-friend-request" event & send 
        * back "response" event & sender who sent request
        */
        socket.on("accept-received-friend-contact" , (receiver)=>
        {
            let sender = 
            {
                id : socket.request.user._id,
                username : socket.request.user.username,
                avatar : socket.request.user.avatar,
                address : (socket.request.user.address !== null) ? socket.request.user.address : ""
            }

            if( SocketIDClientSide[receiver.contactId] )
            {
                SocketIDClientSide[receiver.contactId].forEach( (socketID) => {
                    // & send back who is sending request -> javascript/contactConfig.js
                    socket.broadcast.to(socketID).emit("response-accept-received-friend-contact",sender);
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
    denyReceivedFriendContact : denyReceivedFriendContact,
    acceptReceivedFriendContact : acceptReceivedFriendContact
}