import {check} from "express-validator/check";
import {userError} from "../notification/english.js";

let passwordValidation = [
    check("currentPassword",userError.incorrectCurrentEmail)
        .isLength( { min : 1 }),
    
    check("newPassword",userError.incorrectPassword)
        .isLength( { min : 1 }),

    check("confirmNewPassword",userError.incorrectPasswordConfirmation)
        .custom( (value, {req}) => { return value === req.body.newPassword } )
]

module.exports = passwordValidation;