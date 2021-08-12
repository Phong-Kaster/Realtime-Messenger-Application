let userPassword = {};

function redirectToLoginPage(){
    let timeInterval;
    Swal.fire(
    {
        position : 'top-end',
        icon : 'success',
        title : 'Redirect to login page after 3 seconds',
        html : "<strong></strong>",
        timer : 3000,
        onBeforeOpen : ()=>
        {
            Swal.showLoading();
            timeInterval = setInterval( ()=>
            {
                Swal.getContent().querySelector("strong").textContent = Math.ceil( Swal.getTimeLeft() / 1000 )
            },1000)
        },
        onClose : () =>{
            clearInterval(timeInterval);
        }
      })
      .then( (result) =>
      { 
          $.get("/signout",()=>{location.reload;})
      })
}


/*****************************************************************************************
* 3 function to handle event change password
*****************************************************************************************/
function handleEventChangeCurrentPassword(){
    $("#currentPassword").bind("change", function(){

        let currentPassword = $(this).val();
        
        if( currentPassword.length < 0){
            alertify.alert().set('message', 'Your password must has at least 1 letter').show();
            $(this).val(null);
            delete userPassword.currentPassword;
            return false;
        }

        userPassword.currentPassword = $(this).val();
    })
}
function handleEventChangeNewPassword(){
    $("#newPassword").bind("change", function(){
        let newPassword = $(this).val();

        if( !userPassword.currentPassword){
            alertify.alert().set('message', 'You have to type your current password').show();
            $(this).val(null);
            delete userPassword.newPassword;
            return false;
        }

        if( userPassword.currentPassword == newPassword){
            alertify.alert().set('message', 'Your new password can not familiar with current password').show();
            $(this).val(null);
            delete userPassword.newPassword;
            return false;
        }

        if( newPassword.length < 0)
        {
            alertify.alert().set('message', 'Your new password must has at least 1 letter').show();
            $(this).val(null);
            delete userPassword.newPassword;
            return false;
        }

        userPassword.newPassword = $(this).val();
    })
}
function handleEventChangeConfirmNewPassword(){
    $("#confirmNewPassword").bind("change", function(){

        let confirmNewPassword = $(this).val();

        if( !userPassword.newPassword ){
            alertify.alert().set('message', 'You have to type a new password').show();
            $(this).val(null);
            delete userPassword.confirmNewPassword;
            return false;
        }

        if( confirmNewPassword !== userPassword.newPassword){
            alertify.alert().set('message', 'You confirm password does not match with new password').show();
            $(this).val(null);
            delete userPassword.confirmNewPassword;
            return false;
        }


        userPassword.confirmNewPassword = $(this).val();
    })
}


/*****************************************************************************************
* AJAX function to send PUT request function
*****************************************************************************************/
function ajaxToUpdatePassword(){
    $.ajax({
        url : "/user-update-password",
        type : "put",
        data : userPassword,
        success : function(result)
        {
            $(".password-success-alert").find("span").text(result.messenge);
            $(".password-success-alert").css("display","block");
            $("#password-btn-cancel").click();
            //redirectToLoginPage();

        },
        error : function(error)
        {
            $(".password-error-alert").find("span").text(error.responseText);
            $(".password-error-alert").css("display","block");
            $("#password-btn-cancel").click();
            $.get("/home",()=>{location.reload;})
        }
    })
}


/*****************************************************************************************
* jQuery function to handle event "click" buttons
*****************************************************************************************/
function handleButtonUpdateUserPassword(){
    $("#password-btn-confirm").bind("click",function(){
        
        if( !userPassword.currentPassword || !userPassword.newPassword || !userPassword.confirmNewPassword)
        {
            alertify.alert().set('message', 'You have to fulfill current password - new password - confirm new password').show();
            $("#password-btn-cancel").click();
            return false;
        }

        // show a notification asks user if they are sure ?
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0078FF',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
                // if cancel then empty everything
                if( !result.value ){
                    $("#password-btn-cancel").click();
                }
                // if confirm then call AJAX
                ajaxToUpdatePassword();
          })
    })
}
function handleButtonCancelUpdateUserPassword(){
    $("#password-btn-cancel").bind("click",function(){
        userPassword.currentPassword = "Your current password";
        userPassword.newPassword = "Your new password";
        userPassword.confirmNewPassword = "Your confirm new password";

        $("#currentPassword").val(null);
        $("#newPassword").val(null);
        $("#confirmNewPassword").val(null);
    })
}

$(document).ready(function(){
    // listen event change password
    handleEventChangeCurrentPassword();
    handleEventChangeNewPassword();
    handleEventChangeConfirmNewPassword();

    // user confirms that they want to save their new password
    handleButtonUpdateUserPassword();

    // user changes their mind & cancels update password
    handleButtonCancelUpdateUserPassword();
})