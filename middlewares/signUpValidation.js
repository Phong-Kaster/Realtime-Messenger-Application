import {check} from "express-validator/check";
import {userError} from "../notification/english.js";

let signupValidation = [
    check("email",userError.incorrectEmail)// email value must have email pattern
        .isEmail()
        .trim(),


    check("gender",userError.incorrectGender)//gender value must be male or female
        .isIn( [ "male","female" ]),


    check("password",userError.incorrectPassword)//password have number - uppercase,lower & special letter
        .isLength({ min : 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),


    check("password_confirmation",userError.incorrectPasswordConfirmation)
        .custom( (value, {req} )=> {
            return value === req.body.password;
        })
];

module.exports = signupValidation;