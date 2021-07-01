import {check} from "express-validator/check";
import {notice} from "../notification/english.js";

let signupValidation = [
    check("email",notice.incorrectEmail)// email value must have email pattern
        .isEmail()
        .trim(),


    check("gender",notice.incorrectGender)//gender value must be male or female
        .isIn( [ "male","female" ]),


    check("password",notice.incorrectPassword)//password have number - uppercase,lower & special letter
        .isLength({ min : 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),


    check("password_confirmation",notice.incorrectPasswordConfirmation)
        .custom( (value, {req} )=> {
            return value === req.body.password;
        })
];

module.exports = signupValidation;