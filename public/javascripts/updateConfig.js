function updateInformation (){
    $("#input-change-avatar").bind("change", ()=>{
        let file = $("#input-change-avatar").prop("files")[0];
        let fileExtension = ["image/png","image/jpg","image/jpeg"];
        let fileMaxSize = 104857; // 1 BYTE = 1MB

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

            // append updated user avatar & override image Preview
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
        }
        else
        {
            alertify.alert().set('message', 'Your browser is not supported FileReader !').show(); 
        }
    });
}

$(document).ready(function(){
    updateInformation();
});