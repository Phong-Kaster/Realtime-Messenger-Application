let userAvatar = null;
let userInformation = {};
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

        // size > 1MB
        if( file.size > fileMaxSize)
        {
            alertify.alert().set('message', 'File size must less than 1 MB!').show(); 
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

$(document).ready(function(){
    updateInformation();
    $("#input-btn-update-user").bind("click" , function(){
        if( $.isEmptyObject(userInformation) )
        {
            alertify.alert().set('message', 'You have to change some information before saving !').show(); 
        }

        $.ajax(
            {
            url:"/user/update-avatar",
            type:"put",
            contentType:false,
            processData : false,
            data:userAvatar,
            success:function(success)
            {
                // code
            },
            error:function(error)
            {
                // code
            }
        });
    })

    $("#input-btn-cancel-update-user").bind("click",function(){

        userAvatar = null;
        userInformation = {};
    })
});