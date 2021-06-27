import mongoose from 'mongoose';
const { Schema } = mongoose;

const messengerSchema = new Schema({
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
    text : String, // messenger's content
    file :
    {
        data : Buffer,
        contentType : String,
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

module.exports = mongoose.model('messenger',messengerSchema);