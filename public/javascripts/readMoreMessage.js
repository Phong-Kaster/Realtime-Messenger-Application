let ajaxToRetrieveOlderMessage = (receiverID , quantitySeenMessage , sendToGroup)=>{
    // let topMessage = $(this).find(".bubble:first");
    // let topMessageOffSet = topMessage.offset().top - $(this).scrollTop();

    $.get(`/read-more-message/${receiverID}/${quantitySeenMessage}/${sendToGroup}` , function(data){
        if( !data )
        { 
            alertify.notify("No more message to load" , "error" , 7);
            return false;
        }
        // console.log(data);

        $(".right .chat").find("img.message-loading").remove();
        //$(`.right .chat[data-chat=${receiverID}]`).scrollTop(topMessage.offset().top - topMessageOffSet)
        $(`.right .chat[data-chat=${receiverID}]`).prepend(data.contentRight);

        $(`#imagesModal_${receiverID}`).find(".all-images").append(data.photoModal);
        gridPhotos(5);

        $(`#attachmentsModal_${receiverID}`).find(".list-attachments").append(data.photoModal);
    });
}


/***********************************************
 * handleEventScrollUp
 * scrollTop() = event scroll mouse up
 ***********************************************/
let handleEventScrollUp = ()=>{
    $(".right .chat").unbind("scroll").on("scroll" ,function(){
        let messageLoading = `<img src="/images/chat/message-loading.gif" class="message-loading">`;
        let quantitySeenMessage = $(this).find(".bubble").length;
        let receiverID = $(this).data("chat");
        let sendToGroup = $(this).hasClass("chat-in-group") ? true : false ;

        //console.log(sendToGroup);
        //console.log( typeof(sendToGroup));

        if( $(this).scrollTop() == 0 )
        {
            $(this).prepend(messageLoading);

            ajaxToRetrieveOlderMessage( receiverID , quantitySeenMessage , sendToGroup );
        }

        //$(this).find("div.message-loading").remove();
        
    });
}

$(document).ready(function(){
    handleEventScrollUp();
});