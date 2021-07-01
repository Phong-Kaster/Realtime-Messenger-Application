export const notice = {
    incorrectEmail : "Email must have pattern yourname@gmail.com",
    incorrectGender : "Your gender must be male or female",
    incorrectPassword : "Your password have at least 8 letter include number, special character ....",
    incorrectPasswordConfirmation: "Your password confirmation does not familiar with password"
};

export const userError = {
    usedAccount : "Your email have been used",
    removedAccount : "Your account was removed from our system",
    deactivateAccount : "Your account was created but it's not activated by your email.Please check your email to activate your account"
};

export const successfulNotice = {
    userCreated : (email) =>{
        return `Your account <strong>${email}</strong> was created successfully.Please check your email to active !`
    }
}