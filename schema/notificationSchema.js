const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    senderId : String,
    receiverId : String,
    type : String,
    isRead : { type : Boolean , default : false },
    createdAt : { type : Number, default : Date.now }
});

notificationSchema.statics = {
    createNew(information)
    {
        return this.create(information);
    },
    cancelFriendRequest( senderID , receiverID , type)
    {
        return this.deleteOne({
            $and : [ 
                { "senderId" : senderID },
                { "receiverId" : receiverID },
                { "type" : type }
            ]}).exec();
    },
    retrieveNotification( receiverID )
    {
        return this.find({ "receiverId" : receiverID}).limit(10).sort({$natural:-1}).exec();
    },
    countUnreadNotification( receiverID )
    {
        return this.countDocuments({
            $and : [ 
                { "receiverId" : receiverID },
                { "isRead" : false }
            ]
        }).exec();
    },
    retrieveMoreNotification( receiverID , quantitySeenNotifications )
    {
        return this.find({ "receiverId" : receiverID})
        .limit(10)
        .sort({$natural:-1})
        .skip(quantitySeenNotifications)
        .exec();
    },
    /*************************************************************
     * @param {string} receiverID 
     * @param {array} senderIDs 
     * @returns change field "isRead" from false to true
     *************************************************************/
    markAsRead( receiverID , senderIDs )
    {
        return this.updateMany({
            $and : [
                {"receiverId" : receiverID},
                {"senderId": {$in:senderIDs}}]
            },
            { "isRead":true }).exec();
    },
    deleteReceivedFriendContactNotification( receiverId , senderID )
    {
        return this.deleteOne({
            $and : [
                {"senderId" : senderID},
                {"receiverId" : receiverId}
            ]
        }).exec();
    }
}

const notificationType = {
    friendRequest : "send friend request",
    acceptFriendRequest : " accept friend request"
}

const notificationTemplate = ( sender , type , isRead)=>{

    
    if( type == notificationType.friendRequest )
    {
        if( !isRead )
        {
            return `<span class="unseen-notification" data-uid="${ sender._id }">
                <img class="avatar-small" src="/images/users/${sender.avatar}" alt=""> 
                <strong> ${sender.username} </strong> sent to you a friend request
                </span><br><br>`;
        }
        return `<span data-uid="${ sender._id }">
                <img class="avatar-small" src="/images/users/${sender.avatar}" alt=""> 
                <strong> ${sender.username} </strong> sent to you a friend request
                </span><br><br>`;
    }

    if( type == notificationType.acceptFriendRequest)
    {
        if( !isRead )
        {
            return `<span class="unseen-notification" data-uid="${ sender._id }">
                <img class="avatar-small" src="/images/users/${sender.avatar}" alt=""> 
                <strong> ${sender.username} </strong> accepted your friend request
                </span><br><br>`;
        }
        return `<span data-uid="${ sender._id }">
                <img class="avatar-small" src="/images/users/${sender.avatar}" alt=""> 
                <strong> ${sender.username} </strong> accepted your friend request
                </span><br><br>`;
    }
}

module.exports = {
   model : mongoose.model('notification',notificationSchema),
   type : notificationType,
   notificationTemplate : notificationTemplate
}