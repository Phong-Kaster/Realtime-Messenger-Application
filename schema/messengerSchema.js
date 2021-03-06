const mongoose = require('mongoose');
const { Schema } = mongoose;

const messengerSchema = new Schema({
    senderId : String,
    receiverId : String,
    typeConversation : String,
    typeMessenger : String,
    sender: // who send
    {
        id : String,
        username : String,
        avatar : String
    },
    receiver : // who receiver
    {
        id : String,
        username : String,
        avatar : String
    },
    content : String, // messenger's content
    file :
    {
        data : Buffer,
        fileType : String,
        fileName : String
    },
    status : 
    {
        type : Boolean,
        default : false
    },
    createdAt : { type : Number, default : Date.now },
    updatedAt : { type : Number, default : null },
    deletedAt : { type : Number, default : null }
});

const typeConversation = {
    individual : "individual",
    group : "group"
}

const typeMessenger = {
    text : "text",
    photo : "photo",
    document : "document"
}

messengerSchema.statics = {
    createNew(information)
    {
        return this.create(information)
    },
    retrieveIndividualContentMessenger(senderId , receiverId)
    {
        return this.find({
            $or: [
                {$and: [ {"senderId":senderId},{"receiverId":receiverId} ]},
                {$and: [ {"senderId":receiverId},{"receiverId":senderId} ]}
            ]
        })
        .sort({"createdAt" : -1})
        .limit(10)
        .exec();
    },
    /* -1 : get  older to newer messages */
    retrieveGroupContentMessenger(receiverId)
    {
        return this.find({"receiverId": receiverId})
        .sort({"createdAt" : -1})
        .limit(10)
        .exec();
    },
    removeMessageOfConversation(senderId , receiverId)
    {
        return this.deleteMany({
            $or: [
                {$and: [ {"senderId":senderId},{"receiverId":receiverId} ]},
                {$and: [ {"senderId":receiverId},{"receiverId":senderId} ]}
            ]
        }).exec();
    },
    retrieveMoreGroupContentMessenger( receiverId , quantitySeenMessage)
    {
        return this.find({"receiverId": receiverId})
        .sort({"createdAt" : -1})
        .skip(quantitySeenMessage)
        .limit(10)
        .exec();
    },
    retrieveMoreIndividualContentMessenger(senderId, receiverId, quantitySeenMessage)
    {
        return this.find({
            $or: [
                {$and: [ {"senderId":senderId},{"receiverId":receiverId} ]},
                {$and: [ {"senderId":receiverId},{"receiverId":senderId} ]}
            ]
        })
        .sort({"createdAt" : -1})
        .skip(quantitySeenMessage)
        .limit(10)
        .exec();
    }
}

module.exports = {
    model : mongoose.model('messenger',messengerSchema),
    typeConversation : typeConversation,
    typeMessenger : typeMessenger
}