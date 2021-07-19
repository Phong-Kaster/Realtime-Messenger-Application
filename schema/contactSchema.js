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

contactSchema.statics = {
    createNew(information)
    {
        return this.create(information);
    },
    /**
     * 
     * @param {*} id 
     * @returns  all friends of user have this id
     */
    searchFriendsByID(id)
    {
        return this.find({
            /* search myself as userId or search myself as contactId 
            & return all record have userID & contact Id as myself */
            $or : [
                { "userId" : id },
                { "contactId" : id }
            ]
        }).exec();
    }
}

module.exports = mongoose.model('contact',contactSchema);