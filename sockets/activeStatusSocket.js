/*************************************************************
 * @param {*} io
 * 
 * Step 1:  Server send SocketID of active user to all client
 * Step 2:  If a user have just logged in, server also notify this event
 * Step 3:  If a user have just logged out, event "server-send-a-new-inactive-user" is activated
 *************************************************************/
let activeStatus = (io)=>{
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
        
        let activeUsers = Object.keys(SocketIDClientSide);

        /* Step 1 */
        socket.emit("server-send-active-users", activeUsers);

        /* Step 2 */
        socket.broadcast.emit("server-send-a-new-active-user", socket.request.user._id);

        
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

            /* for group conversation */
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
            /* Step 3 */
            socket.broadcast.emit("server-send-a-new-inactive-user", socket.request.user._id)
        })
    });
}

module.exports = activeStatus;