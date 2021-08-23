/************************************************************
 * listen event click button send add friend request
 * @targetID whose Username is sent friend request
 * @returns DOM Object for changing button from "send friend request" to "cancel friend request" 
 * and reverse for cancel function
 * unbind("click") helps delete all request before triggering this event again.
 * @returns increase value indicating in contact management
 * Step 1 : retrieve receiver ID
 * Step 2 : send AJAX post request to create a friend request record
 * Step 3 : if step 2 success, hide "send request" button & show "cancel request"
 * Step 4 : update number of sent friend request
 * Step 5 : prepend this tab into modal "sent fiend request"
 * Step 6 : emit a event named "send-add-friend-request" to server
 ************************************************************/
function sendAddFriendRequest(){

    $(".user-add-new-contact").bind("click",function(){
        /* Step 1 */
        let targetID = $(this).data("uid");
        
        /* Step 2 */
        $.post("/send-add-friend-request", {uid:targetID} ,function(data){
            if( data.success )
            {
                /* Step 3 */
                $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetID} ]`).hide();
                $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetID} ]`).css("display","inline-block");
                
                /* Step 4 */
                increaseResultNumber("count-sent-friend-contact");
                
                /* Step 5 */
                let userReceivedFriendRequest = $("#find-user").find(`ul li[data-uid = ${targetID} ]`).get(0).outerHTML;
                $("#request-contact-sent").find("ul").prepend(userReceivedFriendRequest);

                /* Step 6 */
                // (1)emit an event & send targetID -> javascript/contactSocket.js (2)
                socket.emit("send-add-friend-request",{ contactId : targetID });
            }
        })
    });
}
function cancelFriendRequest(){
    $(".user-remove-request-contact").unbind("click").on("click",function(){
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
                
                decreaseResultNumber("count-sent-friend-contact");

                $("#request-contact-sent").find(`li[data-uid=${targetID}]`).remove();

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
    
    let userReceivedFriendRequest = `<li class="_contactList" data-uid="${sender.id}">
                                        <div class="contactPanel">
                                            <div class="user-avatar">
                                                <img src="./images/users/${sender.avatar}" alt="">
                                            </div>
                                            <div class="user-name">
                                                <p>
                                                    ${sender.username}
                                                </p>
                                            </div>
                                            <br>
                                            <div class="user-address">
                                                <span>&nbsp ${sender.address}</span>
                                            </div>
                                            <div class="user-acccept-contact-received" data-uid="${sender.id}">
                                                Accept
                                            </div>
                                            <div class="user-reject-request-contact-received action-danger" data-uid="${sender.id}">
                                                Refuse
                                            </div>
                                        </div>
                                    </li>`;
    $("#request-contact-received").find("ul").prepend(userReceivedFriendRequest);
})


socket.on("response-cancel-friend-request" , function(sender){
    // notification icons
    $(".noti_content").find(`span[data-uid = ${sender.id}]`).html("");
    // notification model
    $("ul.list-notifications").find(`li>span[data-uid = ${sender.id}]`).parent().remove();

    decreaseResultNumber("count-request-contact-received");
    decreaseNotificationNumber("noti_contact_counter",1);
    decreaseNotificationNumber("noti_counter",1);
    // delete in modal "dang cho xac nhan"
    $("#request-contact-received").find(`li[data-uid=${sender.id}]`).remove();
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
            alertify.alert().set('message','Your keyword is not valid.Only letter & number').show();
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

    // listen event when wanna cancel request sent friend request contacts
    cancelFriendRequest();
});