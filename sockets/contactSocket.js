/************************************************************
 * @param {*} io from socket.io library
 ************************************************************/
let sendAddFriendRequest = (io)=> {
    io.on("connection" , (socket)=>{
        socket.on("send-add-friend-request" , (data)=>{
            console.log(data);
        });
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