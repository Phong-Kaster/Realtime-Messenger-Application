/* ======================= LIBRARY ======================= */
const contactSocket = require('../sockets/contactSocket.js');
const acceptOrDenyFriendContact = require('../sockets/acceptOrDenyFriendContactSocket');
const messageSocket = require('../sockets/messageSocket.js');
/* ======================= FUNCTION ======================= */
let incSocket = (io)=>{
    /* contactSocket handle realtime events like send friend request , cancel friend */
    contactSocket.sendAddFriendRequest(io);
    contactSocket.cancelFriendRequest(io);

    /* accept | deny received friend request */
    acceptOrDenyFriendContact.denyReceivedFriendContact(io);
    acceptOrDenyFriendContact.acceptReceivedFriendContact(io);
    acceptOrDenyFriendContact.unfriend(io);

    /* send message */
    messageSocket.sendMessage(io);
    messageSocket.typeMessageOn(io);
    messageSocket.typeMessageOff(io);
}

module.exports = incSocket;