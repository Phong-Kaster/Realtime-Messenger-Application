/*********************************************************************
 * @param {*} message | object | contains information of user's message
 * @param {*} dataChat | [data-chat="ha378"] | is a property in HTML used to 
 * indicate what conversation user is chatting
 * @param {*} receiverID | who receive this message
 * 
 * 
 * function executes request send a post AJAX to server
 * 
 * Step 1 : initiate @myMessage in order to insert in chatting screen
 * Step 2 : append this @myMessage div & scroll current chatting screen down
 * Step 3 : update preview & time in the left screen
 * Step 4 : move the conversation that user has just sent message to the top of list
 * Step 4.1 : create a customized event named "click.moveToTop"
 * Step 4.2 : get the tag is covering the conversation - parent
 * Step 4.3 : file "ul" tag closest & prepend the conversation to the top
 * Step 4.4 : $(this).off("click.moveToTop") to stop this event
 * Step 5 : click on the conversation
 * Step 6 : emit event "send-message"
 *********************************************************************/
function ajaxToSendMessage(message, dataChat, receiverID)
{
    $.post("/send-message", message , function(data){
        let emittedData = {
            message: message,
        }
        /* Step 1 */
        let myMessage = $(`<div class="convert-emoji bubble me data-mess-id="${data.message._id}"></div>`);
        myMessage.text(data.message.content);

        if( message.sendToGroup ){
            emittedData.groupId = receiverID;
        }
        else{
            emittedData.receiverId = receiverID;
        }
        /* Step 2 */
        $(`.right .chat[data-chat = ${dataChat}]`).append(myMessage);
        nineScrollRight(dataChat);
        /* Step 3 */
        $(`.person[data-chat = ${dataChat}]`).find("span.time").removeClass("realtime-received-message").html( moment(data.message.createdAt).locale("en").startOf("seconds").fromNow() );
        $(`.person[data-chat = ${dataChat}]`).find("span.preview").removeClass("realtime-received-message").html(`You: ${data.message.content}`);
       
        /* Step 4 */
        $(`.person[data-chat = ${dataChat}]`).on("click.moveToTop", function(){
            let conversationTab = $(this).parent();
            $(this).closest("ul").prepend(conversationTab);
            $(this).off("click.moveToTop");
        });

        /* Step 5 */
        $(`.person[data-chat = ${dataChat}]`).click();

        /* Step 6 */
        socket.emit("send-message" , emittedData);

        typingMessageOff(dataChat);

        if( $(`.chat[data-chat = ${dataChat}]`).find(".bubble-typing-gif").length){
            $(`.chat[data-chat = ${dataChat}]`).find(".bubble-typing-gif").remove();
        }
    }).fail(function(error){
        alertify.notify(error.responseJSON[0], "error" , 7);
    });
}



/*********************************************************************
 * this function catches event "response-send-message" in sender-side
 * 
 * handle Event Write Message listen & handle when user type & send a message
 * 
 * @param {*} dataChat | or data-chat | is a property in HTML used to 
 * indicate what conversation user is chatting
 * "keyup" is event click on keyboard
 * 
 * Step 1 : get receiverID & content of message
 * Step 2 : wrap information of message include receiverID & its content
 * Step 3 : insert "sendToGroup" if this message is send to a group chat
 * Step 4 : call a post AJAX request to send @message
 * Step 5 : empty "div" tag where user has just typed message
 *********************************************************************/
function handleEventWriteMessage(dataChat){
    $(".emojionearea").unbind("keyup").on("keyup", function(element){
        /* 13 is key-code of ENTER */
        if( element.which === 13)
        {
            /* Step 1 */
            let receiverID = $(`#write-chat-${dataChat}`).data("chat");
            let content = $(`#write-chat-${dataChat}`).val();
            
            if( !receiverID.length || !content.length ){
                return false;
            }

            /* Step 2 */
            let message = {
                receiverID: receiverID,
                content: content
            }

            /* Step 3 */
            if( $(`#write-chat-${dataChat}`).hasClass("group") )
            {
                message.sendToGroup = true;
            }

            /* Step 4 */
            ajaxToSendMessage(message , dataChat , receiverID);

            /* Step 5 */
            $(`#write-chat-${dataChat}`).val("");
            $(this).find(".emojionearea-editor").text("");
        }
    });
}



/*********************************************************************
 * @param {*} dataChat | [data-chat="ha378"] | is a property in HTML used to 
 * indicate what conversation user is chatting
 * 
 * handle event click on a conversation that a new message have just come
 * @return remove class("realtime-received-message") in this conversation
 *********************************************************************/
function handleEventClickOnConversation(dataChat){
    $(`.person[data-chat = ${dataChat}]`).unbind("click").on("click", function(){

        $(this)
            .find("span.time")
            .removeClass("realtime-received-message");

        $(this)
            .find("span.preview")
            .removeClass("realtime-received-message");
    });

}



/*********************************************************************
 * this function catches event "response-send-message" in receiver-side
 * 
 * @param {*} dataChat | [data-chat="ha378"] | is a property in HTML used to 
 * indicate what conversation user is chatting
 * 
 * @sender | object | contains information of the message which has just come
 * @dataChat indicates what conversation is triggered
 * @message contains html tag to insert 
 * "emojione.toImage" converts native unicode emoji and shortnames directly to images
 * 
 * Step 1 : define 2 variables: @dataChat & @message
 * Step 2 : verify the message is send to individual or group.Specify dataChat
 * Step 3 : append the @message and scroll screen to the bottom
 * Step 4 : update preview , timestamp & addClass("realtime-received-message")
 * Step 5 : move the conversation to the top of list but don't click on automatically
 * Step 6 : listen click event in order to removeClass("realtime-received-message")
 *********************************************************************/
$(document).ready(function(){
    socket.on("response-send-message" , function(sender)
    {
        /* Step 1 */
        let dataChat;
        let message;
        
        /* Step 2 */
        if( sender.groupId ){
            dataChat = sender.groupId;
            message = $(`<div class="convert-emoji bubble you data-mess-id="${sender.message._id}">
                        <img src="/images/users/${sender.avatar}" class="avatar-small" title="#"></img>
                            &nbsp;&nbsp;${sender.message.content}&nbsp;
                        </div>`);
            convertedMessage = emojione.toImage(message.html());
            message.html(`${convertedMessage}`);
        }
        else{
            dataChat = sender.id;
            message = $(`<div class="convert-emoji bubble you data-mess-id="${sender.message._id}"></div>`);
            message.text(sender.message.content);
        }        
        
        /* Step 3 */
        $(`.right .chat[data-chat = ${dataChat}]`).append(message);
        nineScrollRight(dataChat);

        /* Step 4 */
        $(`.person[data-chat = ${dataChat}]`).find("span.time").addClass("realtime-received-message").html( moment(sender.message.createdAt).locale("en").startOf("seconds").fromNow() );
        let preview = (sender.groupId) ? ( sender.username+": "+sender.message.content) : (sender.message.content);
        $(`.person[data-chat = ${dataChat}]`).find("span.preview").addClass("realtime-received-message").html(`${preview}`);

        /* Step 5 */
        $(`.person[data-chat = ${dataChat}]`).on("auto.moveToTop", function(){
            let conversationTab = $(this).parent();
            $(this).closest("ul").prepend(conversationTab);
            $(this).off("auto.moveToTop");
        });
        $(`.person[data-chat = ${dataChat}]`).trigger("auto.moveToTop");

        handleEventClickOnConversation(dataChat);
    })
});