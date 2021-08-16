/*****************************************************
 * execute a AJAX post request to send document as a message
 * @param {*} photoFormData | is used to send data as: photo, document to server
 /******************************************************/
 function ajaxToSendDocumentMessage( documentFormData , dataChat , isChatGroup){
    $.ajax({
        url : "/send-document-message",
        type : "post",
        cache : false,
        contentType : false,
        processData : false,
        data : documentFormData,
        success : function(data)
        {
            console.log(data);

            /* Step 1 */
            let emittedData =  { message : data.message };
            if( isChatGroup ){
                emittedData.groupId = data.message.receiverId;
                
            }else{
                emittedData.receiverId = data.message.receiverId;
            }

            /* Step 2 */
            let document = 
            `<div class="convert-emoji bubble me bubble-attachment-file" data-mess-id="${data.message._id}">
                    <a href="data: ${data.message.file.fileType}; base64, ${bufferBase64(data.message.file.data.data)}" 
                        download="${data.message.fileName }">
                        ${data.message.file.fileName}
                    </a>
            </div>`;
           
             /* Step 3 */
             $(`.right .chat[data-chat = ${dataChat}]`).append(document);
             nineScrollRight(dataChat);
 
             let documentModal = `
             <li>
                <a href="data: ${data.message.file.fileType}; base64,${bufferBase64(data.message.file.data)}" 
                     download="${data.message.file.fileName}">
                    ${data.message.file.fileName}
                </a>
            </li>`;
             $(`#attachmentsModal_${dataChat}`).find("ul.list-attachments").prepend(documentModal);
             
             /* Step 3 */
             $(`.person[data-chat = ${dataChat}]`).find("span.time").removeClass("realtime-received-message").html( moment(data.message.createdAt).locale("en").startOf("seconds").fromNow() );
             $(`.person[data-chat = ${dataChat}]`).find("span.preview").removeClass("realtime-received-message").html(`You sent a document`);
 
             /* Step 4 */
             $(`.person[data-chat = ${dataChat}]`).on("click.moveToTop", function(){
                 let conversationTab = $(this).parent();
                 $(this).closest("ul").prepend(conversationTab);
                 $(this).off("click.moveToTop");
             });
             $(`.person[data-chat = ${dataChat}]`).click();
 
             /* Step 5 */
             socket.emit("send-document-message" , emittedData );
        },
        error : function(error)
        {
            alertify.notify(error.responseJSON[0], "error" , 7);
        }
    })
}

let handleEventWriteDocumentMessage = (dataChat)=>{
    $(`#attachment-chat-${dataChat}`).unbind("change").on("change" , function(){
        /* Step 1 */
        let file = $(this).prop("files")[0];
        if( !file )
        {
            return false;
        }
        /* Step 2 */
        let fileMaxSize = 5242880; // 1024 BYTE = 1 KB | 1024KB = 1 MB
        
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
        let documentFormData = new FormData();
        documentFormData.append("my-attachment-chat",file);
        documentFormData.append("receiverID", receiverId);

        if( $(this).hasClass("chat-in-group")){
            documentFormData.append("sendToGroup", true);
            isChatGroup = true;
        }

        /* Step 5 */
        ajaxToSendDocumentMessage( documentFormData , dataChat , isChatGroup );
    });
}


$(document).ready(function(){
    socket.on( "response-send-document-message" , function(sender){
        /* Step 1 */
        let dataChat;
        let document;
        
        /* Step 2 */
        if( sender.groupId ){
            dataChat = sender.groupId;
            document = 
            `<div class="convert-emoji bubble you bubble-attachment-file" data-mess-id="${sender.message._id}">
                <img src="/images/users/${sender.message.sender.avatar}" class="avatar-small" title="${sender.message.sender.username}">
                    <a href="data:${sender.message.file.fileType}; base64, ${ bufferBase64(sender.message.file.data.data) }" 
                        download="${sender.message.file.fileName}">
                                 ${sender.message.file.fileName}
                    </a>
                </div>`;
        }else{
            dataChat = sender.id;
            document = `<div class="convert-emoji bubble you bubble-attachment-file" data-mess-id="${sender.message._id}">
                            <a href="data:${sender.message.file.fileType}; base64, ${bufferBase64(sender.message.file.data.data)}" 
                                download="${sender.message.file.fileName}">
                                ${sender.message.file.fileName}
                            </a>
                        </div>`
        }        

        /* Step 3 */
        $(`.right .chat[data-chat = ${dataChat}]`).append(document);
        nineScrollRight(dataChat);

        let documentModal = `<li>
                                <a href="data:${sender.message.file.fileType}; base64,${bufferBase64(sender.message.file.data.data)}" 
                                        download="${sender.message.file.fileName}">
                                        ${sender.message.file.fileName}
                                </a>
                            </li>`;
        $(`#attachmentsModal_${dataChat}`).find("ul.list-attachments").prepend(documentModal);
        /* Step 4 */
        $(`.person[data-chat = ${dataChat}]`).find("span.time").addClass("realtime-received-message").html( moment(sender.message.createdAt).locale("en").startOf("seconds").fromNow() );
        let preview = (sender.groupId) ? (sender.username + " sent a document") : ("You have received a document")
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