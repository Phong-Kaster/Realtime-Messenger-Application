const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const userSchema = new Schema({
    username:  String, // String is shorthand for {type: String}
    gender: 
    {
        type : String,
        default : "male"
    },
    phone : String,
    address : String,
    avatar : 
    {
        type : String,
        default : "Blue.jpg"
    },
    role : 
    {
        type : String,
        default : "user"
    },
    local :
    {
        email : String,
        password : String,
        isActive :
        {
            type : Boolean,
            default : false
        },
        verifiedToken : String
    },
    facebook :
    {
        uid : String,
        token : String,
        email : String
    },
    google :
    {
        uid : String,
        token : String,
        email : String
    },
    createdAt : { type : Number, default : Date.now },
    updatedAt : { type : Number, default : null },
    deletedAt : { type : Number, default : null }
});

userSchema.statics = {
    createNew(item)
    {
        return this.create(item);
    },
    findByEmail(email)
    {
        return this.findOne( {"local.email" : email}).exec();
    },
    removeById(id)
    {
        return this.findByIdAndRemove(id).exec();
    },
    verifyToken(token)
    {
        return this.findOneAndUpdate(
            { "local.verifiedToken":token },
            { "local.isActive":true,
               "local.verifiedToken":null
        }).exec();
    },
    findByToken(token)
    {
        return this.findOne({"local.verifiedToken":token}).exec();
    },
    findByIdentification(id)
    {
        return this.findById(id).exec();
    },
    findByIdentificationSession(id)
    {
        return this.findById(id,{"local.password": 0}).exec();
    },
    findByFacebookUID(uid)
    {
        return this.findOne( {"facebook.uid" : uid}).exec();
    },
    findByGoogleUID(uid)
    {
        return this.findOne( {"google.uid" : uid}).exec();
    },
    updateInformation(id,information)
    {
        // after updating successfully , mongoose still returns former data
        return this.findByIdAndUpdate(id ,information).exec();
    },
    updatePassword(id,hashedPassword)
    {
        return this.findByIdAndUpdate(id, {"local.password" : hashedPassword}).exec();
    },
    /**
     * Character "i" indicates that no distingue Upper case or Lower case
     * @param {*} deprecatedUserIDs is eradicated from returned result
     * @param {*} keyword is condition to search
     * @returns records include _id,username,address,avatar that they aren't in deprecatedUserIDs array + account must active 
     * successfully + username or local email or google email or facebook email include this keyword.
     */
    searchByInvalidUserIDsAndKeyword( invalidUserIDs,keyword)
    {
        return this.find(
        { 
            $and : [
                { "_id" : { $nin : invalidUserIDs }},
                { "local.isActive" : true },
                { $or : [
                    { "username" : {"$regex" : new RegExp(keyword,"i") }},
                    { "local.email" : {"$regex" : new RegExp(keyword,"i")}},
                    { "google.email" : {"$regex" : new RegExp(keyword,"i")}},
                    { "facebook.email" : {"$regex" : new RegExp(keyword,"i")}}
                ]}
            ]
        },
        { _id : 1 , username : 1 , address : 1 , avatar : 1}).exec();
    },
    findByIdentificationAndRetrieveSpecificFields(id)
    {
        return this.findById(id, {_id:1, username: 1, address: 1, avatar: 1}).exec();
    }
}
/**
 * methods : handle the schema properties to do something
 * statics : get record with condition but can not handle with found record
 */
userSchema.methods = {
    verifyPassword( verifiedPassword ){
        // return a promise true or false
        return bcrypt.compare( verifiedPassword,this.local.password );
    }
}

module.exports = mongoose.model('user',userSchema);