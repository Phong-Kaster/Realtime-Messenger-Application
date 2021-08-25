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
    },
    retrieveFriendContact(userId)
    {
        return this.find({
            $and : [
                { $or : [{"userId":userId},
                         {"contactId":userId}]
                },
                {"status" : true}
            ]
        })
        .limit(10)
        .sort({"updatedAt": -1})
        .exec();
    },
    retrieveSentFriendContact(userId)
    {
        return this.find({
            $and : [
                {"userId" : userId},
                {"status" : false}
            ]
        })
        .limit(10)
        .sort({$natural:-1})
        .exec();
    },
    retrieveReceivedFriendContact(userId)
    {
        return this.find({
            $and : [
                {"contactId" : userId},
                {"status" : false}
            ]
        })
        .limit(10)
        .sort({$natural:-1})
        .exec()
    },
    countFriendContact(userId)
    {
        return this.countDocuments({
            $and : [
                { $or : [{"userId":userId},
                         {"contactId":userId}]
                },
                {"status" : true}
            ]
        })
        .exec();
    },
    countSentFriendContact(userId)
    {
        return this.countDocuments({
            $and : [
                {"userId" : userId},
                {"status" : false}
            ]
        })
        .exec();
    },
    countReceivedFriendContact(userId)
    {
        return this.countDocuments({
            $and : [
                {"contactId" : userId},
                {"status" : false}
            ]
        })
        .exec()
    },
    /************************************************************
     * @param {*} userId | string | who is logging in
     * @param {*} quantitySeenFriendContacts | number | number of friend contacts that user have seen
     * @returns more friend contacts | object | that user have not seen in their screen
     ************************************************************/
    retrieveMoreFriendContact(userId,quantitySeenFriendContacts)
    {
        return this.find({
            $and: [
                { $or: [ {"userId" : userId},
                         {"contactId" : userId}]},
                {"status": true}
            ]
        })
        .sort({"updatedAt": -1})
        .skip(quantitySeenFriendContacts)
        .limit(10)
        .exec();
    },
    /************************************************************
     * @param {*} userId | string | who is logging in
     * @param {*} quantitySeenSentFriendRequestContacts | number | number of friend contacts that user have sent friend request
     * @returns more contacts | object | that user have sent friend request but they have not seen by user
     ************************************************************/
    retrieveMoreSentFriendContact(userId,quantitySeenSentFriendRequestContacts)
    {
        return this.find({
            $and : [
                {"userId" : userId},
                {"status" : false}
            ]
        })
        .limit(10)
        .skip(quantitySeenSentFriendRequestContacts)
        .sort({"updatedAt" : -1})
        .exec();
    },
    retrieveMoreReceivedFriendContact(userId,quantitySeenReceivedFriendContacts)
    {
        return this.find({
            $and : [
                {"contactId" : userId},
                {"status" : false}
            ]
        })
        .limit(10)
        .skip(quantitySeenReceivedFriendContacts)
        .sort({$natural:-1})
        .exec()
    },
    denyReceivedFriendContact(userId,contactId)
    {
        return this.deleteOne({
            $and:[
                {"userId" : contactId},
                {"contactId" : userId},
                {"status" : false}
            ]
        }).exec();
    },
    acceptReceivedFriendContact(userId,contactId)
    {
        return this.updateOne({
            $and : [
                {"userId":contactId},
                {"contactId":userId},
                {"status" : false}
            ]},
            { "status" : true, updatedAt : Date.now() })
        .exec();
    },
    unfriend(userId,contactId)
    {
        return this.deleteOne({
            $or : [
                { $and : [{"userId" : contactId}, {"contactId" : userId}, {status:true}] },
                { $and : [{"userId" : userId}, {"contactId": contactId}, {status:true}] }
            ]
        }).exec();
    },
    updateStatusConversation(userId,contactId)
    {
        return this.updateOne({
            $or: [
                { $and: [{"userId": userId},{"contactId": contactId}] },
                { $and: [{"userId": contactId},{"contactId": userId}] }
            ]
        },{"updatedAt": Date.now()})
    },
    searchFriendByID(userId)
    {
        return this.find({
            $and: [
                { $or:[ {"userId" : userId} , {"contactId" : userId}] },
                { "status" : true }
            ]
        })
        .sort({"updatedAt" : -1})
        .exec();
    }
}

module.exports = mongoose.model('contact',contactSchema);