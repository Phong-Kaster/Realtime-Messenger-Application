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
    messengerAmount : // how many messenger do we have ?
    {
        type : Number,
        default : 0
    },
    userId : String, // host of group
    member : [ { userId : String } ], // array of userId
    createdAt : { type : Number, default : Date.now },
    updatedAt : { type : Number, default : null },
    deletedAt : { type : Number, default : null } 
});

chatGroupSchema.statics = {
    retrieveGroupConversation(userId)
    {
        return this.find({
            member: {$elemMatch: {"userId": userId}}
        })
        .sort({$natural:-1})
        .limit(10)
        .exec();
    },
    createNew(information)
    {
        return this.create(information);
    }
}

module.exports = mongoose.model('chatGroup',chatGroupSchema);