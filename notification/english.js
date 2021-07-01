export const userError = {
    usedAccount : "Your email have been used",
    removedAccount : "Your account was removed from our system",
    deactivateAccount : "Your account was created but it's not activated by your email.Please check your email to activate your account",
    incorrectEmail : "Email must have pattern yourname@gmail.com",
    incorrectGender : "Your gender must be male or female",
    incorrectPassword : "Your password have at least 8 letter include number, special character ....",
    incorrectPasswordConfirmation: "Your password confirmation does not familiar with password"
};
export const systemError = {
    unsentEmail : "The email can't be send.Please get contact with our customer service"
}
export const successfulNotice = {
    userCreated : (email) =>{
        return `Your account <strong>${email}</strong> was created successfully.Please check your email to active !`
    }
}

export const subject = {
    confirmAccount : "Confirm activate your account ",
    template : (verifyPath) =>{
        return `<h2> You receiver this email because you confirmed your account in Realtime Messenger Application</h2>
        <h3>Please click the link below to finish confirmation</h3>
        <h3><a href="${verifyPath}" target="blank">${verifyPath}</a></h3>`
    }
}