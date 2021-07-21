const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    senderId : String,
    receiverId : String,
    type : String,
    isRead : { type : Boolean , default : false},
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
        return this.find({ "receiverId" : receiverID}).limit(5).sort({$natural:-1}).exec();
    }
}

const notificationType = {
    friendRequest : "send add friend request"
}

const notificationTemplate = ( sender , type , isRead)=>{

    
    if( type == notificationType.friendRequest )
    {
        if( !isRead )
        {
            return `<span class="unsent-notification" data-uid="${ sender._id }">
                <img class="avatar-small" src="/images/users/${sender.avatar}" alt=""> 
                <strong> ${sender.username} </strong> gửi lời mời kết bạn !
                </span><br><br><br>`;
        }
        return `<span data-uid="${ sender._id }">
                <img class="avatar-small" src="/images/users/${sender.avatar}" alt=""> 
                <strong> ${sender.username} </strong> gửi lời mời kết bạn !
                </span><br><br><br>`;
    }
}

module.exports = {
   model : mongoose.model('notification',notificationSchema),
   type : notificationType,
   notificationTemplate : notificationTemplate
}