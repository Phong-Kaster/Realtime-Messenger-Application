/*****************************************************
 * execute a AJAX post request to send photo as a message
 * @param {*} photoFormData | is used to send data as: photo, document to server
 /******************************************************/
function ajaxToSendPhotoMessage(photoFormData){
    $.ajax({
        url : "/send-photo-message",
        type : "post",
        cache : false,
        contentType : false,
        processData : false,
        data : photoFormData,
        success : function(data)
        {
          console.log(data);
        },
        error : function(error)
        {
            alertify.notify(error.responseJSON[0], "error" , 7);
        }
    })
}



/*****************************************************
 * Listen & handle event click "photo" button to send a photo message
 * @param {*} dataChat | [data-chat="ha378"] | is a property in HTML used to 
 * indicate what conversation user is chatting
 * 
 * Step 0 : listen event change 
 * Step 1 : retrieve photo
 * Step 2 : define fileExtension & fileMaxSize to check input data
 * Step 3 : retrieve user ID who receive the photo
 * Step 4 : defile a form data to wrap information
 * Step 5 : call ajax to send photo to server
 /******************************************************/
let handleEventWritePhotoMessage = (dataChat)=>{
    /* Step 0 */
    $(`#image-chat-${dataChat}`).unbind("change").on("change", function(){
        /* Step 1 */
        let file = $(this).prop("files")[0];

        /* Step 2 */
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
        /* Step 3 */
        let receiverId = $(this).data("chat");

        /* Step 4 */
        let photoFormData = new FormData();
        photoFormData.append("my-image-chat",file);
        photoFormData.append("receiverID", receiverId);

        if( $(this).hasClass("chat-in-group")){
            photoFormData.append("sendToGroup", true);
        }

        /* Step 5 */
        ajaxToSendPhotoMessage(photoFormData);
    });
}