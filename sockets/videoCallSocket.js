/**************************************************************************
 * this socket response for socketIO event in public/javascript/videoCall.js
 * 
 * socket.on("caller-side-check-listener"): returns 2 case about listener-side:
 *              1.Listener is online with @callInformation 
 *              2.Listener is offline
 * 
 * socket.on("listener-side-pass-peer-id-to-server"): Server notify to caller-side that listener-side ready to be called
 * 
 * socket.on("caller-side-call-listener"): Server responses caller-side's request - make a video call
 * socket.on("caller-side-cancel-call-listener"): Server handle event caller-side cancel his/her request
 * 
 * socket.on("listener-side-refuse-video-call"): Server notify to caller-side that listener-side can not answer
 * socket.on("listener-side-accept-video-call": Server handle both caller-side & listener-side
 * 
 * socket.on("member-join-group-chat"): only when a group have been create, catch "member-join-group-chat" & push socket.id 
 * to SocketIDClientSide[groupID] to emit event  to correct member
 * @param {*} io 
 **************************************************************************/
let videoCall = (io)=>{
    let SocketIDClientSide = {};
    
    io.on("connection", async (socket)=>{
        /* Step 1 */
        let callerID = socket.request.user._id;
        /* Step 2 */
        if( SocketIDClientSide[callerID] )
        {
            SocketIDClientSide[callerID].push(socket.id);
        }
        else
        {
            SocketIDClientSide[callerID] = [socket.id];
        }

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


        /* Step 3 */
        socket.on("caller-side-check-listener" , function(emittedData){
            /* Step 3.1 */
            /* listener online */
            if( SocketIDClientSide[emittedData.listenerID] )
            {
                let callInformation = {
                    callerID : socket.request.user._id,
                    callerName : emittedData.callerName,
                    callerAvatar : socket.request.user.avatar,
                    listenerID : emittedData.listenerID
                }
  
                if( SocketIDClientSide[emittedData.listenerID] )
                {
                    SocketIDClientSide[emittedData.listenerID].forEach((element)=>{
                        socket.broadcast.to(element).emit("response-caller-side-listener-online", callInformation);
                    });
                }

            }
            /* Step 3.2 */
            /* listener offline */
            else
            {
                socket.emit("response-caller-side-listener-offline");
            }
        });

        /* Step 4 */
        /* Server notice that listener ready to be called */
        socket.on("listener-side-pass-peer-id-to-server" , function(emittedData){
            let callInformation = {
                callerID     : emittedData.callerID,
                callerName   : emittedData.callerName,
                callerAvatar : emittedData.callAvatar,

                listenerID      : emittedData.listenerID,
                listenerName    : emittedData.listenerName,
                listenerPeerID  : emittedData.listenerPeerID
            }

            if( SocketIDClientSide[emittedData.callerID] )
            {
                SocketIDClientSide[emittedData.callerID].forEach((element)=>{
                    socket.broadcast.to(element).emit("response-listener-side-pass-peer-id-to-server", callInformation);
                });
            }
        });


        
        /* Step 5 */
        /* Step 5.1: Caller takes a call to listener */
        socket.on("caller-side-call-listener" , function(emittedData){
            let callInformation = {
                callerID     : emittedData.callerID,
                callerName   : emittedData.callerName,
                callerAvatar : emittedData.callAvatar,

                listenerID      : emittedData.listenerID,
                listenerName    : emittedData.listenerName,
                listenerPeerID  : emittedData.listenerPeerID
            }

            if( SocketIDClientSide[emittedData.listenerID] )
            {
                SocketIDClientSide[emittedData.listenerID].forEach((element)=>{
                    socket.broadcast.to(element).emit("response-caller-side-call-listener", callInformation);
                });
            }
        });
        /* Step 5.2: Caller change their mind and cancel video call */
        socket.on("caller-side-cancel-call-listener" , function(emittedData){
            let callInformation = {
                callerID     : emittedData.callerID,
                callerName   : emittedData.callerName,
                callerAvatar : emittedData.callAvatar,

                listenerID      : emittedData.listenerID,
                listenerName    : emittedData.listenerName,
                listenerPeerID  : emittedData.listenerPeerID
            }

            if( SocketIDClientSide[emittedData.listenerID] )
            {
                SocketIDClientSide[emittedData.listenerID].forEach((element)=>{
                    socket.broadcast.to(element).emit("response-caller-side-cancel-call-listener", callInformation);
                });
            }
        });
        /* Step 5.3: Listener refuse video call */
        socket.on("listener-side-refuse-video-call" , function(emittedData){
            let callInformation = {
                callerID     : emittedData.callerID,
                callerName   : emittedData.callerName,
                callerAvatar : emittedData.callAvatar,

                listenerID      : emittedData.listenerID,
                listenerName    : emittedData.listenerName,
                listenerPeerID  : emittedData.listenerPeerID
            }

            if( SocketIDClientSide[emittedData.callerID] )
            {
                SocketIDClientSide[emittedData.callerID].forEach((element)=>{
                    socket.broadcast.to(element).emit("response-listener-side-refuse-video-call", callInformation);
                });
            }
        });
        /* Step 5.4: Listener accept video call */
        socket.on("listener-side-accept-video-call" , function(emittedData){
            let callInformation = {
                callerID     : emittedData.callerID,
                callerName   : emittedData.callerName,
                callerAvatar : emittedData.callAvatar,

                listenerID      : emittedData.listenerID,
                listenerName    : emittedData.listenerName,
                listenerPeerID  : emittedData.listenerPeerID
            }
            
            if( SocketIDClientSide[emittedData.callerID] )
            {
                SocketIDClientSide[emittedData.callerID].forEach((element)=>{
                    socket.broadcast.to(element).emit("response-listener-side-accept-video-call-to-caller", callInformation);
                });
            }

             if( SocketIDClientSide[emittedData.listenerID] )
             {
                socket.join("cats");
             }
             io.to("cats").emit("response-listener-side-accept-video-call-to-listener", callInformation);
        });



        /* trigged if F5 , open new tab, close browser ,...
        * delete old socketId of sender & receiver
        */ 
        socket.on("disconnect",()=>
        {
            // delete old socketId when tabs closed
            SocketIDClientSide[callerID] = SocketIDClientSide[callerID].filter((socketId)=>{
                return socketId !== socket.id;
            })
            
            // if user shut down PC
            if( !SocketIDClientSide[callerID].length){
                delete SocketIDClientSide[callerID];
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
        })
    });
}

module.exports = videoCall ;