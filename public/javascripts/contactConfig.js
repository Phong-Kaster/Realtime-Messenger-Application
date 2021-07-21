/************************************************************
 * listen event click button send add friend request
 * @targetID whose Username is sent friend request
 * @returns DOM Object for changing button from "send friend request" to "cancel friend request" 
 * and reverse for cancel function
 * @returns increase value indicating in contact management
 ************************************************************/
function sendAddFriendRequest(){

    $(".user-add-new-contact").bind("click",function(){
        let targetID = $(this).data("uid");
        
        $.post("/send-add-friend-request", {uid:targetID} ,function(data){
            if( data.success )
            {
                // hide "send request" button
                $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetID} ]`).hide();
                // display "cancel request" button
                $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetID} ]`).css("display","inline-block");
                
                increaseResultNumber("count-request-contact-sent");
                // (1)emit an event & send targetID -> javascript/contactSocket.js (2)
                socket.emit("send-add-friend-request",{ contactId : targetID });
            }
        })
    });
}
function cancelFriendRequest(){
    $(".user-remove-request-contact").bind("click",function(){
        let targetID = $(this).data("uid");
        $.ajax({
            url : "/cancel-friend-request",
            type : "delete",
            data : { uid : targetID },
            success : function()
            {
                // display send request button
                $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetID} ]`).css("display","inline-block");
                // hide "cancel request" button
                $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetID} ]`).hide();
                
                decreaseResultNumber("count-request-contact-sent");
                //socket.emit("cancel-friend-request" ,{ contactId : targetID });
            },
            error : function(error)
            {
                console.log(error);
            }
        })
    })
}


// (3) listen response & receive "sender"
socket.on("response-send-add-friend-request", function(sender){
    let notification = 
    `<span data-uid="${ sender.id }">
        <img class="avatar-small" src="/images/users/${sender.avatar}" alt=""> 
        <strong> ${sender.username} </strong> đã chấp nhận lời mời kết bạn của bạn!
    </span><br><br><br>`;

    $(".noti_content").prepend(notification);
    increaseResultNumber("count-request-contact-received");
    increaseNotificationNumber("noti_contact_counter");
    increaseNotificationNumber("noti_counter");
    
})



/* check input is username which is being searching valid or not ?  */
function search(element){

    let keyword = $("#keyword").val();
    let regexUsername = /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/;
    

    // 13 is Key-code of Enter
    if(element.which === 13 || element.type === "click")
    {
        if( keyword.length < 0)
        {
            alertify.alert().set('message', 'Your gender must write a username or e-mail').show();
            return false;
        }

        if( !regexUsername.test(keyword) )
        {
            alertify.alert().set('message','Your keyword  is not valid.Only letter & number').show();
            return false;
        }

        $.get(`/search/${keyword}`,function(data){
            $("#find-user ul").html(data);
            sendAddFriendRequest();
            cancelFriendRequest();
        })
    }
}

/* handle event search user to listen username is being searching */
function handleEventSearchUser(){
    $("#keyword").bind("keypress" , search );
}

/* handle Button search user to handle event click button search */
function handleButtonSearchUser(){
    $("#btn-search-keyword").bind("click" ,search );
}

$(document).ready(function(){

    handleEventSearchUser();
   
    handleButtonSearchUser();
});