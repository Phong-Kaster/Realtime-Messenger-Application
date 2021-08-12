/* the middleware check input message */
import {check} from "express-validator/check";
import {userError} from "../notification/english.js";

let messageValidation = [
    check("content" , userError.emptyMessage)
        .isLength({ min : 1})
]

module.exports = messageValidation;