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
 * Step 2 : push socket.id for @senderID
 * Step 3 : push socket.id for @senderID 's group chat
 * Step 4 : only when a group have been create, catch "member-join-group-chat" & push socket.id 
 * to SocketIDClientSide[groupID] to emit event  to correct member
 * Step 5 : catch "send-photo-message" from client-side & handle by @emittedData include: groupId or receiverId
 * Step 6 : check if receiver loges out, remove their socket IDs
 *********************************************************************/
let photoMessageSocket = (io)=>{
    let SocketIDClientSide = {};
    
    io.on("connection", async (socket)=>{
        /* Step 1 */
        let senderID = socket.request.user._id;


        /* Step 2 */
        if( SocketIDClientSide[senderID] )
        {
            SocketIDClientSide[senderID].push(socket.id);
        }
        else
        {
            SocketIDClientSide[senderID] = [socket.id];
        }


        /* Step 3 */
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


        /* Step 4 */
        socket.on("member-join-group-chat", (emittedData)=>{
            let groupID = emittedData;
            if(SocketIDClientSide[groupID])
            {
                SocketIDClientSide[groupID].push(socket.id);
            }
            else
            {
                SocketIDClientSide[groupID] = [socket.id];
            }
        });


        /* Step 5 */
        socket.on("send-photo-message", (emittedData)=>{
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
                    socket.broadcast.to(element).emit("response-send-photo-message", sender);
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

module.exports = photoMessageSocket;