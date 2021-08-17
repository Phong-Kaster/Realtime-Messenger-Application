/*****************************************************
 * execute a AJAX post request to send photo as a message
 * @param {*} photoFormData | is used to send data as: photo, document to server
 /******************************************************/
function ajaxToSendPhotoMessage( photoFormData , dataChat , isChatGroup){
    $.ajax({
        url : "/send-photo-message",
        type : "post",
        cache : false,
        contentType : false,
        processData : false,
        data : photoFormData,
        success : function(data)
        {
            /* Step 1 */
            let emittedData =  { message : data.message };
            if( isChatGroup ){
                emittedData.groupId = data.message.receiverId;
                
            }else{
                emittedData.receiverId = data.message.receiverId;
            }

            /* Step 2 */
            let photo = 
            $(`<div class="convert-emoji bubble me bubble-image-file data-mess-id="${data.message._id}">
                    <img src="data: ${data.message.file.fileType}; base64, 
                    ${ bufferBase64(data.message.file.data.data) }" class="show-image-chat">
            </div>`);
            convertedMessage = emojione.toImage(photo.html());
            photo.html(`${convertedMessage}`);

            /* Step 3 */
            $(`.right .chat[data-chat = ${dataChat}]`).append(photo);
            nineScrollRight(dataChat);

            let photoModal = `<img src="data: ${data.message.file.fileType}; base64, ${ bufferBase64(data.message.file.data.data) }">`;
            $(`#imagesModal_${dataChat}`).find("div.all-images").append(photoModal);
            
            /* Step 3 */
            $(`.person[data-chat = ${dataChat}]`).find("span.time").removeClass("realtime-received-message").html( moment(data.message.createdAt).locale("en").startOf("seconds").fromNow() );
            $(`.person[data-chat = ${dataChat}]`).find("span.preview").removeClass("realtime-received-message").html(`You sent a photo`);

            /* Step 4 */
            $(`.person[data-chat = ${dataChat}]`).on("click.moveToTop", function(){
                let conversationTab = $(this).parent();
                $(this).closest("ul").prepend(conversationTab);
                $(this).off("click.moveToTop");
            });
            $(`.person[data-chat = ${dataChat}]`).click();

            /* Step 5 */
            socket.emit("send-photo-message" , emittedData );
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
        if( !file )
        {
            return false;
        }
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
        let isChatGroup = false;
        /* Step 4 */
        let photoFormData = new FormData();
        photoFormData.append("my-image-chat",file);
        photoFormData.append("receiverID", receiverId);

        if( $(this).hasClass("chat-in-group")){
            photoFormData.append("sendToGroup", true);
            isChatGroup = true;
        }

        /* Step 5 */
        ajaxToSendPhotoMessage( photoFormData , dataChat , isChatGroup );
    });
}



$(document).ready(function(){
    socket.on("response-send-photo-message" , function(sender){
        /* Step 1 */
        let dataChat;
        let photo;
        
        /* Step 2 */
        if( sender.groupId ){
            dataChat = sender.groupId;
            photo = 
            $(`<div class="convert-emoji bubble you bubble-image-file data-mess-id="${sender.message._id}">
                    <img src="/images/users/${sender.avatar}" class="avatar-small" title="#"></img>
                    &nbsp;&nbsp;
                    <img src="data: ${sender.message.file.fileType}; base64, 
                    ${ bufferBase64(sender.message.file.data.data) }" class="show-image-chat">
            </div>`);
            
        }
        else{
            dataChat = sender.id;
            photo = $(`<div class="convert-emoji bubble you bubble-image-file data-mess-id="${sender.message._id}">
                            <img src="data: ${sender.message.file.fileType}; base64, 
                            ${ bufferBase64(sender.message.file.data.data) }" class="show-image-chat">
                        </div>`);
        }        
        convertedMessage = emojione.toImage(photo.html());
        photo.html(`${convertedMessage}`);

        /* Step 3 */
        $(`.right .chat[data-chat = ${dataChat}]`).append(photo);
        nineScrollRight(dataChat);
        
        let photoModal = `<img src="data: ${sender.message.file.fileType}; base64, ${ bufferBase64(sender.message.file.data.data) }">`;
        $(`#imagesModal_${dataChat}`).find("div.all-images").append(photoModal);

        /* Step 4 */
        $(`.person[data-chat = ${dataChat}]`).find("span.time").addClass("realtime-received-message").html( moment(sender.message.createdAt).locale("en").startOf("seconds").fromNow() );
        let preview = (sender.groupId) ? (sender.username + " sent a photo") : ("You have received a photo")
        $(`.person[data-chat = ${dataChat}]`).find("span.preview").addClass("realtime-received-message").html(`${preview}`);

        /* Step 5 */
        $(`.person[data-chat = ${dataChat}]`).on("auto.moveToTop", function(){
            let conversationTab = $(this).parent();
            $(this).closest("ul").prepend(conversationTab);
            $(this).off("auto.moveToTop");
        });
        $(`.person[data-chat = ${dataChat}]`).trigger("auto.moveToTop");

        handleEventClickOnConversation(dataChat);
    });
});