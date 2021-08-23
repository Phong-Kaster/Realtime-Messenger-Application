/*************************************************************************************************
 * @param {*} dataChat | lays on views/contentRight.ejs | indicates what conversation user is chatting
 * handle event "typing-message-on" to show other user that this user is typing a message
 *************************************************************************************************/
let typingMessageOn = (dataChat)=>{
    let DOM = $(`#write-chat-${dataChat}`);
    let userId = DOM.data("chat");

    if( DOM.hasClass("group") )
    {
        socket.emit("typing-message-on", {groupId:userId});
    }
    else
    {
        socket.emit("typing-message-on", {receiverId:userId});
    }
}



/*************************************************************************************************
 * @param {*} dataChat | lays on views/contentRight.ejs | indicates what conversation user is chatting
 * handle event "typing-message-off" to show other user that this user finish typing a message
 *************************************************************************************************/
let typingMessageOff = (dataChat)=>{
    let DOM = $(`#write-chat-${dataChat}`);
    let userId = DOM.data("chat");

    if( DOM.hasClass("group") )
    {
        socket.emit("typing-message-off", {groupId:userId});
    }
    else
    {
        socket.emit("typing-message-off", {receiverId:userId});
    }
}


/*****************************************
 * handel event click on "chat" button in contact management modal
 * views/home/section/contact - line 72
 * @messenger | string | is another user whom user is chatting
 * when user click on the button - screen chat to "messenger" popping up
 * immediately
 *****************************************/
let handleEventClickChatButton = ()=>{
    $(".user-talk").unbind("click").on("click", function(){
        let messenger = $(this).data("uid");
        console.log(messenger);

        $(".modal-content").find(".close").click();

        $("#all-chat").find(`ul a[data-target="#to_${messenger}"]`).click();
    });
}
$(document).ready(function(){
    socket.on("response-typing-message-on",function(sender){
        let groupTyping = `<div class="convert-emoji bubble you data-mess-id="${sender.id}">
                                <img src="/images/users/${sender.avatar}" class="avatar-small" title="#"></img>
                                    &nbsp;&nbsp; ${sender.username} is typing
                            </div>
                            <div class="bubble-typing-gif bubble you">
                                <img  src="/images/chat/typing.gif">
                            </div>`;

        let individualTyping = `<div class="bubble you bubble-typing-gif">
                                    <img src="/images/chat/typing.gif">
                                </div>`;

        let selectedTyping = ( sender.groupId ) ? groupTyping : individualTyping;
        let dataChat = ( sender.groupId ) ? sender.groupId : sender.id;

        // let result = ( sender.groupId ) ? "group" : "individual";
        // console.log(result);

        if( $(`.chat[data-chat = ${dataChat}]`).find(".bubble-typing-gif").length ){
            return false;
        }
                
        $(`.chat[data-chat = ${dataChat}]`).append(selectedTyping);
        
        nineScrollRight(dataChat);
    });

    socket.on("response-typing-message-off", function(sender){
        let result = ( sender.groupId ) ? "group" : "individual";
        let dataChat = ( sender.groupId ) ? sender.groupId : sender.id;
        if( !$(`.chat[data-chat = ${dataChat}]`).find(".bubble-typing-gif").length ){
            return false;
        }
        
        $(`.chat[data-chat = ${dataChat}]`).find(".bubble-typing-gif").remove();

        if( sender.groupId )
        {
            //console.log($(`.chat[data-chat = ${dataChat}]`).find("div").eq(-3).text().trim());
            // delete "phongkaster12 is typing"
            $(`.right .chat[data-chat = ${dataChat}]`).find("div").eq(-2).remove();
        }
        
        nineScrollRight(dataChat);
    });

    handleEventClickChatButton();
});