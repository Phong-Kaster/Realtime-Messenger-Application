/* ======================= LIBRARY ======================= */
const contactSocket = require('../sockets/contactSocket.js');
/* ======================= FUNCTION ======================= */
let incSocket = (io)=>{
    contactSocket.sendAddFriendRequest(io);
    contactSocket.cancelFriendRequest(io);
}

module.exports = incSocket;