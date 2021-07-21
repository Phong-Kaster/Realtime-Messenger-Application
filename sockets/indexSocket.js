/* ======================= LIBRARY ======================= */
const contactSocket = require('../sockets/contactSocket.js');
/* ======================= FUNCTION ======================= */
let incSocket = (io)=>{
    /* contactSocket handle realtime events like send friend request , cancel friend */
    contactSocket.sendAddFriendRequest(io);
    contactSocket.cancelFriendRequest(io);
}

module.exports = incSocket;