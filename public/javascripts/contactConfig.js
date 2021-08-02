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
                socket.emit("cancel-friend-request" ,{ contactId : targetID });//(1) event emit
            },
            error : function(error)
            {
                console.log(error);
            }
        })
    })
}



/************************************************************
 * @sender contains information who is sending request.
 * socket.on catches event sent back & handle bases on "name" event
 ************************************************************/
// (3) event 
socket.on("response-send-add-friend-request", function(sender){
    let notification = 
    `<span class="unseen-notification" data-uid="${ sender.id }">
        <img class="avatar-small" src="/images/users/${sender.avatar}" alt=""> 
        <strong> ${sender.username} </strong> sent to you a friend request
    </span><br><br><br>`;
    // notification icon
    $(".noti_content").prepend(notification);
    // notification modal
    $("ul.list-notifications").prepend(`<li>${notification}</li>`);

    increaseResultNumber("count-request-contact-received");
    increaseNotificationNumber("noti_contact_counter",1);
    increaseNotificationNumber("noti_counter",1);
    
})
socket.on("response-cancel-friend-request" , function(sender){
    // notification icons
    $(".noti_content").find(`span[data-uid = ${sender.id}]`).html("");
    // notification model
    $("ul.list-notifications").find(`li>span[data-uid = ${sender.id}]`).parent().remove();

    decreaseResultNumber("count-request-contact-received");
    decreaseNotificationNumber("noti_contact_counter",1);
    decreaseNotificationNumber("noti_counter",1);
});


/* check input is username which is being searching valid or not ?  */
function search(element){

    let keyword = $("#keyword").val();
    let regexUsername = /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/;
    

    // 13 is Key-code of Enter
    if(element.which === 13 || element.type === "click")
    {
        if( keyword.length < 0)
        {
            alertify.alert().set('message', 'Your keyword must write a username or e-mail').show();
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