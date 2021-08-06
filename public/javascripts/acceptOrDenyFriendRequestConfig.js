/************************************************************
 * views/home/section/contact.ejs - line 140
 * listen & handle event deny friend request
 ************************************************************/
let denyReceivedFriendContact = ()=>{
    $(".user-reject-request-contact-received").bind("click" ,function(){
        let senderID = $(this).data("uid");
        $.ajax({
            url: "/deny-received-friend-contact",
            type: "delete",
            data: { uid: senderID},
            success: function(data)
            {
                if( data.success )
                {
                    // views/home/section/navbar.ejs - line 38
                    decreaseResultNumber("noti_contact_counter");

                    // views/home/section/contact.ejs - line 30
                    decreaseResultNumber("count-received-friend-contact");
                    

                    $("#request-contact-received").find(`li[data-uid = ${senderID}]`).remove();
                    
                    socket.emit("deny-received-friend-contact" , {contactId: senderID});
                }
            }
        })
    });
}



/************************************************************
 * views/home/section/contact.ejs - line 137
 * listen & handle event accept friend request
 * @senderID | string | who sent friend request to @user logging
 ************************************************************/
let acceptReceivedFriendContact = ()=>{
    $(".user-acccept-contact-received").bind("click", function(){
        let senderID = $(this).data("uid");
        $.ajax({
            url: "/accept-received-friend-contact",
            type: "put",
            data: {uid: senderID},
            success: function(data)
            {
                if( data.success )
                {
                    
                    let senderReceivedFriendTab = $("#request-contact-received").find(`ul li[ data-uid = ${senderID}]`);
                    

                    $(senderReceivedFriendTab).find(".user-acccept-contact-received").remove();
                    $(senderReceivedFriendTab).find(".user-reject-request-contact-received").remove();
                    $(senderReceivedFriendTab)
                        .find(".contactPanel")
                        .append(`
                                <div class="user-talk" data-uid="${senderID}">
                                        Trò chuyện
                                </div>
                                <div class="user-remove-contact action-danger" data-uid="${senderID}">
                                        Xóa liên hệ
                                </div>`);


                    let senderFriendTab = senderReceivedFriendTab.get(0).outerHTML;
                    $("#contacts").find("ul").prepend(senderFriendTab);
                    $("#request-contact-received").find(`ul li[ data-uid = ${senderID}]`).remove();

                    decreaseResultNumber("count-received-friend-contact");
                    decreaseResultNumber("noti_contact_counter");
                    increaseResultNumber("count-friend-contact");

                    socket.emit("accept-received-friend-contact" , {contactId: senderID});
                }
            }
        })
            
    });
}



socket.on("response-deny-received-friend-contact" , function(sender){
    // delete notification icons 
    $(".noti_content").find(`span[data-uid = ${sender.id}]`).html("");
    // delete notification model
    $("ul.list-notifications").find(`li>span[data-uid = ${sender.id}]`).parent().remove();


    // update number contact - views/home/section/contact.ejs - line 22
    decreaseResultNumber("count-sent-friend-contact");


    // update number notification - views/home/section/navbar.ejs - line 38 & 48
    decreaseNotificationNumber("noti_contact_counter",1);
    decreaseNotificationNumber("noti_counter",1);
})

socket.on("response-accept-received-friend-contact" , function(sender){
    let notification = 
    `<span class="unseen-notification" data-uid="${ sender.id }">
        <img class="avatar-small" src="/images/users/${sender.avatar}" alt=""> 
        <strong> ${sender.username} </strong> accepted your friend request
    </span><br><br><br>`;
    // notification icon
    $(".noti_content").prepend(notification);
    // notification modal
    $("ul.list-notifications").prepend(`<li>${notification}</li>`);

    increaseNotificationNumber("noti_counter",1);
    increaseNotificationNumber("noti_contact_counter",1);

    increaseResultNumber("count-friend-contact");
    decreaseResultNumber("count-sent-friend-contact");

    $("#request-contact-sent").find(`ul li[data-uid = ${sender.id}]`).remove();

    let friendTab =
        `<li class="_contactList" data-uid="${sender.id}">
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
                <div class="user-talk" data-uid="${sender.id}">
                    Trò chuyện
                </div>
                <div class="user-remove-contact action-danger" data-uid="${sender.id}">
                    Xóa liên hệ
                </div>
            </div>
        </li>`;

        $("#contact").find("ul").prepend(friendTab);
});

$(document).ready(function(){

    denyReceivedFriendContact();

    acceptReceivedFriendContact();
});