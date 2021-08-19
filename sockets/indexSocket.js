/* ======================= LIBRARY ======================= */
const contactSocket = require('../sockets/contactSocket.js');
const acceptOrDenyFriendContact = require('../sockets/acceptOrDenyFriendContactSocket');
const messageSocket = require('../sockets/messageSocket.js');
const photoMessageSocket = require('../sockets/photoMessageSocket.js');
const documentMessageSocket = require('../sockets/documentMessageSocket.js');
const videoCallSocket = require('../sockets/videoCallSocket.js');
const activeStatusSocket = require('../sockets/activeStatusSocket.js');
/* ======================= FUNCTION ======================= */
let incSocket = (io)=>{
    /* contactSocket handle realtime events like send friend request , cancel friend */
    contactSocket.sendAddFriendRequest(io);
    contactSocket.cancelFriendRequest(io);

    /* accept | deny received friend request */
    acceptOrDenyFriendContact.denyReceivedFriendContact(io);
    acceptOrDenyFriendContact.acceptReceivedFriendContact(io);
    acceptOrDenyFriendContact.unfriend(io);

    /* send text message */
    messageSocket.sendMessage(io);
    messageSocket.typeMessageOn(io);
    messageSocket.typeMessageOff(io);

    /* send photo message */
    photoMessageSocket(io);

    /* send document message */
    documentMessageSocket(io);

    videoCallSocket(io);

    activeStatusSocket(io);
}

module.exports = incSocket;