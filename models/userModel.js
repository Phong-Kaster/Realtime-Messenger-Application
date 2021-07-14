const userSchema = require('../schema/userSchema.js');

/**
 * 
 * @param {*} id that the identifier of user
 * @param {*} information is a bundle of information which user is trying to edit
 * @returns update information
 */
let updateUserInformation = (id,information) =>{
    return userSchema.updateInformation(id,information);
}

module.exports = {
    updateUserInformation : updateUserInformation
}