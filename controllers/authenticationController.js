import { validationResult } from "express-validator/check";

let signin = (req,res) =>{
    return res.render("./authentication/authentication.ejs",{ 
        errors : req.flash("errors"), 
        success : req.flash("success") 
    });
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
        req.flash("errors",errorsArray);
        return res.redirect("/signin");
    }
    console.log(req.body); 
        
}
module.exports = {
    signin : signin,
    signup : signup
};