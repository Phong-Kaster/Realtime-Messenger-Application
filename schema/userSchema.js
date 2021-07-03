const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username:  String, // String is shorthand for {type: String}
    gender: 
    {
        type : String,
        default : "male"
    },
    phone : Number,
    address : String,
    avatar : 
    {
        type : String,
        default : "default-avatar.jpg"
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
        email : { type : String , trim : true }
    },
    google :
    {
        uid : String,
        token : String,
        email : { type : String , trim : true }
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
    }
}

module.exports = mongoose.model('user',userSchema);