const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatGroupSchema = new Schema({
    name : String,
    userAmount : // how many user do we have ?
    {
        type : Number,
        min : 3,
        max : 200
    },
    messageAmount : // how many messenger do we have ?
    {
        type : Number,
        default : 0
    },
    userId : String, // host of group
    member : [ { userId : String } ], // array of userId
    createdAt : { type : Number, default : Date.now },
    updatedAt : { type : Number, default : Date.now },
    deletedAt : { type : Number, default : null } 
});

chatGroupSchema.statics = {
    retrieveGroupConversation(userId)
    {
        return this.find({
            member: {$elemMatch: {"userId": userId}}
        })
        .sort({"updatedAt" : -1})
        .limit(10)
        .exec();
    },
    createNew(information)
    {
        return this.create(information);
    },
    findByIdentification(id)
    {
        return this.findById(id).exec();
    },
    getTheLatestMessage(id, messageAmount)
    {
        return this.findByIdAndUpdate(id,{
            "messageAmount":messageAmount,
            "updatedAt": Date.now()
        }).exec();
    },
    retrieveChatGroupIDs(userId)
    {
        return this.find({
            "member": {$elemMatch: {"userId": userId}}
        }, {_id: 1})
        .exec();
    },
    readMoreChatGroup(userId, quantitySeenGroup)
    {
        return this.find({
            "member": {$elemMatch: {"userId": userId}}
        }, {_id: 1})
        .sort({"updatedAt": -1})
        .skip(quantitySeenGroup)
        .exec();
    }
}

module.exports = mongoose.model('chatGroup',chatGroupSchema);