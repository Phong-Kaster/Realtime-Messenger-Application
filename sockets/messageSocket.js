/*********************************************************************
 * @param {*} io | socket.io library
 * @sender | who is logging in & emit this event
 * 
 * Listen event "send-message" from ajaxToSendMessage - public/javascript/writeMessage.js
 * Because a user can have individual conversation or group conversation so that it is handled for
 * both of them
 * 
 * 
 * Step 1 : define senderID because socket only understand IDs created by it
 * Step 2 : check for individual conversations of @sender
 * Step 3 : check for group conversation of @sender
 * Step 4 : catch "send-message" from client-side & handle by @emittedData include: groupId or receiverId
 * Step 5 : socket.broadcast.to(element).emit("response-send-message", sender) to 
 * emit "response-send-message" to correct receiver
 * Step 6 : check if receiver loges out, remove their socket IDs
 *********************************************************************/
let sendMessage = (io)=>{
    let SocketIDClientSide = {};
    
    io.on("connection", async (socket)=>{
        let senderID = socket.request.user._id;

        if( SocketIDClientSide[senderID] )
        {
            SocketIDClientSide[senderID].push(socket.id);
        }
        else
        {
            SocketIDClientSide[senderID] = [socket.id];
        }
        /* Step 3 - for group conversation */
        socket.request.user.chatGroupIDs.forEach( (element)=>{
            if( SocketIDClientSide[element._id] )
            {
                SocketIDClientSide[element._id].push(socket.id);
            }
            else
            {
                SocketIDClientSide[element._id] = [socket.id];
            }
        });
        


        socket.on("send-message", (emittedData)=>{
            let sender = {};
            let receiver ;

            if( emittedData.groupId ){
                sender.groupId = emittedData.groupId;
                sender.id = socket.request.user._id;
                sender.message = emittedData.message;
                sender.username = socket.request.user.username;
                sender.avatar = socket.request.user.avatar;
                receiver = emittedData.groupId;
            }

            if( emittedData.receiverId ){
                sender.id = socket.request.user._id;
                sender.message = emittedData.message;

                receiver = emittedData.receiverId;
            }

            if( SocketIDClientSide[receiver] )
            {
                SocketIDClientSide[receiver].forEach((element)=>{
                    socket.broadcast.to(element).emit("response-send-message", sender);
                });
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

            /* Step 3 - for group conversation */
            socket.request.user.chatGroupIDs.forEach( (element)=>{
                // delete old socketId when tabs closed
                SocketIDClientSide[element._id] = SocketIDClientSide[element._id].filter((socketId)=>{
                    return socketId !== socket.id;
                })
                
                // if user shut down PC
                if( !SocketIDClientSide[element._id].length){
                    delete SocketIDClientSide[element._id];
                }
            });
        })
    });
}

module.exports = {
    sendMessage : sendMessage
}