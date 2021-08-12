/* update user config handle events which relate to user information like : avatar,username,... */
/* ======================= GLOBAL CONSTANTS =======================*/
let userAvatar = null;
let userInformation = {};
let userOriginalAvatar;
let userOriginalInformation = {};
/* ======================= FUNCTION =======================*/


/***************************************************************************************** 
 * A bundle functions of handling change event for avatar - username - gender - address - phone 
/*****************************************************************************************/
function handleEventChangeAvatar(){
    $("#input-change-avatar").bind("change", function(){
        let file = $(this).prop("files")[0];
        let fileExtension = ["image/png","image/jpg","image/jpeg"];
        let fileMaxSize = 5242880; // 1024 BYTE = 1 KB | 1024KB = 1 MB
        
        if( $.inArray(file.type ,fileExtension) === -1 )
        {
            alertify.alert().set('message', 'File extension is not accepted.File must be png - jpg - jpeg!').show(); 
            $(this).val(null);
            return false;
        }

        if( file.size > fileMaxSize)
        {
            alertify.alert().set('message', 'File size must less than 5 MB!').show(); 
            $(this).val(null);
            return false;
        }

        // show updated avatar temporary
        if( typeof (FileReader) != undefined)
        {
            // get user avatar at the moments & empty it
            let imagePreview = $("#image-edit-profile");
            imagePreview.empty();

            // append updated user avatar & override imagePreview
            let fileReader = new FileReader();
            fileReader.onload = function (element){
                $("<img>",{
                    "src" : element.target.result,
                    "class" : "avatar img-circle",
                    "id" : "user-avatar",
                    "alt" : "avatar"
                }).appendTo(imagePreview)
            };

            imagePreview.show();
            fileReader.readAsDataURL(file);
            // initiate a form data to store file avatar
            let formData = new FormData();
            formData.append("avatar",file);
            // pass the avatar to userAvatar
            userAvatar = formData;
        }
        else
        {
            alertify.alert().set('message', 'Your browser is not supported FileReader !').show(); 
        }
    });
}
function handleEventChangeUsername(){
    $("#username").bind("change", function(){
        let username = $(this).val();
        let regexUsername = /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/;
        
        
        if( !regexUsername.test(username) || username.length < 3 || username.length > 17 ){
            alertify.alert().set('message', 'Your username length from 3 to 17 character & can not use special character like @ , # , $ , % ,.....').show();
            $(this).val(userOriginalInformation.username);
            delete userInformation.username;
            return false; 
        }


        userInformation.username = $(this).val();
    });
}
function handleEventChangeGenderMale(){
    $("#male-gender").bind("click", function(){
        let gender = $(this).val();

        if( gender != "male"){
            alertify.alert().set('message', 'Your gender must be male or female').show();
            delete userInformation.gender;
            return false;
        }

        userInformation.gender = $(this).val();
    })
}
function handleEventChangeGenderFemale(){
    $("#female-gender").bind("click", function(){
        let gender = $(this).val();

        if( gender != "female"){
            alertify.alert().set('message', 'Your gender must be male or female').show();
            delete userInformation.gender;
            return false;
        }

        userInformation.gender = $(this).val();
    });
}
function handleEventChangeAddress(){
    $("#address").bind("change", function(){
        let address = $(this).val();

        if( address.length < 3 || address.length > 50 ){
            alertify.alert().set('message', 'Your address length from 3 to 50').show();
            $(this).val(userOriginalInformation.address);
            delete userInformation.address;
            return false;
        }

        userInformation.address = $(this).val();
    });
}
function handleEventChangePhone(){
    $("#phone").bind("change", function(){
        let phone = $(this).val();
        let regexPhone = /^(0)[0-9]{9,10}$/;

        if( !regexPhone.test(phone) || phone.length < 10 || phone.length > 11){
            alertify.alert().set('message', 'Your phone length from 10 to 11').show();
            $(this).val(userOriginalInformation.phone);
            delete userInformation.phone;
            return false;
        }

        userInformation.phone = $(this).val();
    })
}


/****************************************************************************************
 * public /user-update-information
 * function "update Information" detects event like "change","click",....to handle
 * check input data like avatar , username , phone , address
 *****************************************************************************************/
function updateInformation (){

    // event change avatar
    handleEventChangeAvatar();

    // event change username
    handleEventChangeUsername();

    // event change gender
    handleEventChangeGenderMale();
    handleEventChangeGenderFemale();

    // event change address
    handleEventChangeAddress();

    // event change phone
    handleEventChangePhone();

}



/*****************************************************************************************
* 2 ajax function to send PUT request 
*****************************************************************************************/
function ajaxToUpdateAvatar(){
    $.ajax({
        url : "/user-update-avatar",
        type : "put",
        cache : false,
        contentType : false,
        processData : false,
        data : userAvatar,
        success : function(result)
        {
            $(".user-success-alert").find("span").text(result.messenge);
            $(".user-success-alert").css("display","block");
            userOriginalAvatar = result.imageSource
            $("#navbar-avatar").attr("src",result.imageSource);
            $("#input-btn-cancel-update-user").click();
        },
        error : function(error)
        {
            $(".user-error-alert").find("span").text(error.responseText);
            $(".user-error-alert").css("display","block");
            $("#input-btn-cancel-update-user").click();
        }
    })
}
function ajaxToUpdateInformation(){
    $.ajax({
        url : "/user-update-information",
        type : "put",
        data : userInformation,
        success : function(result)
        {
            // pass new information into "userOriginalInformation" variable to refresh
            userOriginalInformation = Object.assign( userOriginalInformation,userInformation );

            // refresh username in navbar
            $("#navbar-username").text(userOriginalInformation.username);

            $(".user-success-alert").find("span").text(result.messenge);
            $(".user-success-alert").css("display","block");
            $("#input-btn-cancel-update-user").click();
        },
        error : function(error)
        {
            $(".user-error-alert").find("span").text(error.responseText);
            $(".user-error-alert").css("display","block");
            $("#input-btn-cancel-update-user").click();
        }
    })
}



/********************************************************************************************
* a bundle function that handle event click button
*****************************************************************************************/
function handleButtonUpdateUserInformation(){
    $("#input-btn-update-user").bind("click" , function(){
        if( userAvatar ){
            ajaxToUpdateAvatar();
        }

        if( !$.isEmptyObject(userInformation) ){
            ajaxToUpdateInformation();
        }
    });
}
function handleButtonCancelUpdateUserInformation(){
    $("#input-btn-cancel-update-user").bind("click",function(){
        userAvatar = null;
        userInformation = {};

        
        $("#user-avatar").attr("src",userOriginalAvatar)
        $("#username").val( userOriginalInformation.username )
        userOriginalInformation.gender === "male" ? $("#male-gender").click() : $("#female-gender").click()
        $("#address").val( userOriginalInformation.address)
        $("#phone").val( userOriginalInformation.phone)
    });
}
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
            confirmButtonColor: '#2ECC71',
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
        userPassword = null;
        $("#currentPassword").val(null);
        $("#newPassword").val(null);
        $("#confirmNewPassword").val(null);
    })
}

$(document).ready(function(){
    // retrieve current information of user
    userOriginalAvatar = $("#user-avatar").attr("src");
    userOriginalInformation = {
        username : $("#username").val(),
        gender : $("#male-gender").is(":checked") ? "male" : "female",
        address : $("#address").val(),
        phone : $("#phone").val()
    };

    // retrieve fields they changed include information & password
    updateInformation();



    // user confirms that they want to save their information changes
    handleButtonUpdateUserInformation();

    // user is on the second thoughts and cancel update information
    handleButtonCancelUpdateUserInformation();


});