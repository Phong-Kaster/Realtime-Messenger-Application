const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactSchema = new Schema({
    userId : String, // who send friend request
    contactId : String, // who receive friend request
    status : 
    {
        type : Boolean,
        default : false
    },
    createdAt : { type : Number, default : Date.now },
    updatedAt : { type : Number, default : null },
    deletedAt : { type : Number, default : null }
});

module.exports = mongoose.model('contact',contactSchema);