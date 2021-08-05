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

$(document).ready(function(){

    denyReceivedFriendContact();
});