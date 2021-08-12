function ajaxToSendMessage(message)
{
    $.post("/send-message", message , function(data){
        console.log("writeMessage line 5");
        console.log(data.message);
    }).fail(function(error){
        alertify.notify(error.responseJSON[0], "error" , 7);
    });
}
function handleEventWriteMessage(dataChat){
    $(".emojionearea").unbind("keyup").on("keyup", function(element){
        /* 13 is key-code of ENTER */
        if( element.which === 13)
        {
            let receiverID = $(`#write-chat-${dataChat}`).data("chat");
            let content = $(`#write-chat-${dataChat}`).val();

            if( !receiverID.length || !content.length ){
                return false;
            }

            let message = {
                receiverID: receiverID,
                content: content
            }

            if( $(`#write-chat-${dataChat}`).hasClass("group") )
            {
                message.sendToGroup = true;
            }

            ajaxToSendMessage(message);
        }
    });
}