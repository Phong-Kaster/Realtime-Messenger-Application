/*********************************************************************
 * @param {*} message | object | contains information of user's message
 * @param {*} dataChat | [data-chat="ha378"] | is a property in HTML used to 
 * indicate what conversation user is chatting
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
 *********************************************************************/
function ajaxToSendMessage(message, dataChat)
{
    $.post("/send-message", message , function(data){
        /* Step 1 */
        let myMessage = $(`<div class="convert-emoji bubble me data-mess-id="${data.message._id}"></div>`);

        if( message.sendToGroup == "true" )
        {
            myMessage.text(data.message.content);
        }
        else
        {
            myMessage.text(data.message.content);
        }
        /* Step 2 */
        $(`.right .chat[data-chat = ${dataChat}]`).append(myMessage);
        nineScrollRight(dataChat);

        /* Step 3 */
        $(`.person[data-chat = ${dataChat}]`).find("span.time").html( moment(data.message.createdAt).locale("en").startOf("seconds").fromNow() );
        $(`.person[data-chat = ${dataChat}]`).find("span.preview").html(data.message.content);
       
        /* Step 4 */
        $(`.person[data-chat = ${dataChat}]`).on("click.moveToTop", function(){
            let conversationTab = $(this).parent();
            $(this).closest("ul").prepend(conversationTab);
            $(this).off("click.moveToTop");
        });

        /* Step 5 */
        $(`.person[data-chat = ${dataChat}]`).click();
    }).fail(function(error){
        alertify.notify(error.responseJSON[0], "error" , 7);
    });
}


/*********************************************************************
 * handle Event Write Message listen & handle when user type & send a message
 * @param {*} dataChat | or data-chat | is a property in HTML used to 
 * indicate what conversation user is chatting
 * "keyup" is event click on keyboard
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
            ajaxToSendMessage(message, dataChat);

            /* Step 5 */
            $(`#write-chat-${dataChat}`).val("");
            $(this).find(".emojionearea-editor").text("");
        }
    });
}