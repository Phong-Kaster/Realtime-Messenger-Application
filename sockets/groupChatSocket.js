/***********************************************
 * @senderID | string | who is logging in & emit this event
 * Step 1 : socket.io don't understand what userID is.It only gets socketID
 * we must create an object combine senderID with socket.id
 * Step 2 : retrieve group chat IDs of @senderID .They are rooms that @senderID is a member
 * Step 3 : Emit event "response-create-group-chat" to all members of the group
 * Step 4 : If anyone of the group is online, they emit event "member-join-group-chat"
 * Step 5 : Remove socket.id if some one shut down PC or log out
 ***********************************************/
let groupChatSocket = (io)=>{
    let SocketIDClientSide = {};
    
    io.on("connection", async (socket)=>{
        /* Step 1 */
        let senderID = socket.request.user._id;
        if( SocketIDClientSide[senderID] )
        {
            SocketIDClientSide[senderID].push(socket.id);
        }
        else
        {
            SocketIDClientSide[senderID] = [socket.id];
        }


        /* Step 2 */
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


        /* Step 3 */
        socket.on("create-group-chat", (emittedData)=>{
            let returnedData = emittedData;
            
            emittedData.member.forEach( (element)=>{
                if( SocketIDClientSide[element.userId] && element.userId != senderID)
                {
                    SocketIDClientSide[element.userId].forEach( (e)=>{
                        socket.broadcast.to(e).emit("response-create-group-chat", returnedData);
                    })
                }
            });
        });

        /* Step 4 */
        socket.on("member-join-group-chat", (emittedData)=>{
            if(SocketIDClientSide[emittedData])
            {
                SocketIDClientSide[emittedData].push(socket.id);
            }
            else
            {
                SocketIDClientSide[emittedData] = [socket.id];
            }
        });

        /* Step 5 */
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

module.exports = groupChatSocket;