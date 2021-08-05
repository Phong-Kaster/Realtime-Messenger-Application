/* ======================= LIBRARY ======================= */
const contactSocket = require('../sockets/contactSocket.js');
const acceptOrDenyFriendContact = require('../sockets/acceptOrDenyFriendContactSocket');
/* ======================= FUNCTION ======================= */
let incSocket = (io)=>{
    /* contactSocket handle realtime events like send friend request , cancel friend */
    contactSocket.sendAddFriendRequest(io);
    contactSocket.cancelFriendRequest(io);

    /* accept | deny received friend request */
    acceptOrDenyFriendContact.denyReceivedFriendContact(io);
}

module.exports = incSocket;