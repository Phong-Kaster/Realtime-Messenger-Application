import { validationResult } from "express-validator/check";

let signin = (req,res) =>{
    return res.render("./authentication/authentication.ejs");
};

let signup = (req,res) =>{
    console.log("+++++++++++++++++++++++++++++");
    let errorsArray = [];
    let validationErrors = validationResult(req);

    if( !validationErrors.isEmpty() )
    {
        let errors = Object.values(validationErrors.mapped());

        errors.forEach( element => {
            errorsArray.push( element.msg );
        });
        console.log(errorsArray);
        return;
    }
    console.log(req.body); 
        
}
module.exports = {
    signin : signin,
    signup : signup
};