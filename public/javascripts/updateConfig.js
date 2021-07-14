/* ======================= GLOBAL CONSTANTS =======================*/
let userAvatar = null;
let userInformation = {};
let userOriginalAvatar;
let userOriginalInformation = {};
/* ======================= FUNCTION =======================*/

/**
 * function "update Information" detects event like "change","click",....to handle
 * check input data like avatar , username , phone , address
 */
function updateInformation (){
    // event change avatar
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
    // event change username
    $("#username").bind("change", function(){
        userInformation.username = $(this).val();
    });
    // event change gender
    $("#male-gender").bind("click", function(){
        userInformation.gender = $(this).val();
    })
    $("#female-gender").bind("click", function(){
        userInformation.gender = $(this).val();
    });
    // event change address
    $("#address").bind("change", function(){
        userInformation.address = $(this).val();
    });
    // event change phone
    $("#phone").bind("change", function(){
        userInformation.phone = $(this).val();
    })
}

/**
 * function "ajax to update avatar" wraps a Ajax PUT request to store updated avatar
 */
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


/**
 * function "ajax To Update Information" wraps a Ajax PUT request to store updated information
 */
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


$(document).ready(function(){
    // retrieve current information of user
    userOriginalAvatar = $("#user-avatar").attr("src");
    userOriginalInformation = {
        username : $("#username").val(),
        gender : $("#male-gender").is(":checked") ? "male" : "female",
        address : $("#address").val(),
        phone : $("#phone").val()
    };

    // get changes that user is editing
    updateInformation();

    // ajax to store avatar file into database
    $("#input-btn-update-user").bind("click" , function(){
        if( userAvatar ){
            ajaxToUpdateAvatar();
        }

        if( !$.isEmptyObject(userInformation) ){
            ajaxToUpdateInformation();
        }
    });

    // user is on the second thoughts and cancel
    $("#input-btn-cancel-update-user").bind("click",function(){
        userAvatar = null;
        userInformation = {};
        $("#user-avatar").attr("src",userOriginalAvatar)
        $("#username").val( userOriginalInformation.username )
        userOriginalInformation.gender === "male" ? $("#male-gender").click() : $("#female-gender").click()
        $("#address").val( userOriginalInformation.address)
        $("#phone").val( userOriginalInformation.phone)
    });
});