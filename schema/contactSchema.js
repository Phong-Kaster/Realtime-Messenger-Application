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
    /************************************************************
     * search myself as userId or search myself as contactId & 
     * return all record have userID & contact Id as myself
     * @param {*} id whose user is finding his friends
     * @returns  all friends of user have this id
     ************************************************************/
    searchFriendsByID(id)
    {
        return this.find({
            $or : [{ "userId" : id },{ "contactId" : id }]
        }).exec();
    },
    /************************************************************
     * check if userId & contactId is friend each other or not ?
     * @param {*} userId that account Id is logging in
     * @param {*} contactId that account Id is being searched
     * @returns a record that include both userId and contactId
     ************************************************************/
    isFriend(userId,contactId)
    {
        return this.findOne({
            $or : [ {$and : [ {"userId" : userId } , {"contactId" : contactId}]},
                    {$and : [ {"userId" : contactId} , {"contactId" : userId}]}]
         }).exec();
    },
    /************************************************************
     * @param {*} userId that account ID is logging in
     * @param {*} contactId that account ID we want to cancel add friend request
     * @returns delete the record that have userId & contactId
    ************************************************************/
    cancelFriendRequest(userId,contactId)
    {
        return this.deleteOne({
            $and : [ 
                {"userId" : userId } , 
                {"contactId" : contactId }
        ]}).exec();
    }
}

module.exports = mongoose.model('contact',contactSchema);