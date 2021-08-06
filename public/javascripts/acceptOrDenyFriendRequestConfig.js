/************************************************************
 * views/home/section/contact.ejs - line 140
 * listen & handle event deny friend request
 * the received friend requests are ones that other people send friend request to one user
 * @senderID | string | is the ID whose send friend request
 * @returns eradicate friend request tab that is refused
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
                    
                    // views/home/section/contact.ejs - line 119
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
 * the received friend requests are ones that other people send friend request to one user
 * @senderID | string | is the ID whose send friend request
 * Step 1 : Retrieve senderID who sent this friend request
 * Step 2 : Send a PUT request with AJAX
 * Step 3 : Find Tab contains Sender Information
 * Step 4 : Replace "Xac nhan" & "Xoa yeu cau" buttons with "Tro chuyen" & "Xoa lien he" buttons
 * Step 5 : Go into "contacts" where show friend contacts & prepend the modified Tab
 * Step 6 : Eradicate the former Tab
 * Step 7 : Update number of friend contact | received friend contact
 * Step 8 : Emit a event & wait for response
 ************************************************************/
let acceptReceivedFriendContact = ()=>{
    $(".user-acccept-contact-received").bind("click", function(){
        /* Step 1 */
        let senderID = $(this).data("uid");
        /* Step 2 */
        $.ajax({
            url: "/accept-received-friend-contact",
            type: "put",
            data: {uid: senderID},
            success: function(data)
            {
                if( data.success )
                {
                    /* Step 3 */
                    let senderReceivedFriendTab = $("#request-contact-received").find(`ul li[ data-uid = ${senderID}]`);
                    
                    /* Step 4 */
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
                    /* Step 5 */
                    $("#contacts").find("ul").prepend(senderFriendTab);
                    /* Step 6 */
                    $("#request-contact-received").find(`ul li[ data-uid = ${senderID}]`).remove();
                    /* Step 7 */
                    decreaseResultNumber("count-received-friend-contact");
                    decreaseResultNumber("noti_contact_counter");
                    increaseResultNumber("count-friend-contact");
                    /* Step 8 */
                    socket.emit("accept-received-friend-contact" , {contactId: senderID});
                }
            }
        })
            
    });
}

/************************************************************
 * @param {*} receiverID | string | whom user unfriend
 * listen event click unfriend button & send a DELETE request
 * views/home/section/contact.ejs - line 75
 ************************************************************/
let ajaxToUnfriend = (receiverID)=>{
    $.ajax({
        url: "/unfriend",
        type: "delete",
        data: { receiver : receiverID},
        success: function(data)
        {
            if( data.success )
            {
                $("#contacts").find(`ul li[data-uid = ${receiverID}]`).remove();
                decreaseResultNumber("count-friend-contact");
                socket.emit("unfriend" , {contactId : receiverID});
            }
        }
    })
}
let unfriend = ()=>{
   $(".user-remove-contact").bind("click",function(){

        let receiverID = $(this).data("uid");
        let username = $(this).parent().find("div.user-name p").text().trim();
        // show a notification asks user if they are sure ?
        Swal.fire({
            title: `Are you sure to unfriend with ${username}?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2ECC71',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm'
          }).then((result) => {
                // if cancel then empty everything
                if( !result.value ){
                    return false;
                }
                ajaxToUnfriend(receiverID);
          })

        
   });
}



/************************************************************
 * @sender | object | contains information of who emit this event
 * @sender is the one accept friend request
 * this function handle what will happen receiver-side
 * Step 1 : Send a notification that sender accepted received friend request
 * Step 2 : Update number of notification icon | modal
 * Step 3 : Update number of friend contacts | sent friend contact
 * Step 4 : Eradicate sent friend request tab
 * Step 5 : Prepend new friend in the first row in Friend contacts Tab
 ************************************************************/
socket.on("response-accept-received-friend-contact" , function(sender){
    /* Step 1 */
    let notification = 
    `<span class="unseen-notification" data-uid="${ sender.id }">
        <img class="avatar-small" src="/images/users/${sender.avatar}" alt=""> 
        <strong> ${sender.username} </strong> accepted your friend request
    </span><br><br><br>`;
    // notification icon
    $(".noti_content").prepend(notification);
    // notification modal
    $("ul.list-notifications").prepend(`<li>${notification}</li>`);
    /* Step 2 */
    increaseNotificationNumber("noti_counter",1);
    increaseNotificationNumber("noti_contact_counter",1);
    /* Step 3 */
    increaseResultNumber("count-friend-contact");
    decreaseResultNumber("count-sent-friend-contact");
    /* Step 4 */
    $("#request-contact-sent").find(`ul li[data-uid = ${sender.id}]`).remove();
    /* Step 5 */
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



/************************************************************
 * @sender | object | contains information of who emit this event
 * @sender is the one send unfriend request
 ************************************************************/
socket.on("response-unfriend", function(sender){
    $("#contacts").find(`ul li[data-uid = ${sender.id}]`).remove();
    decreaseResultNumber("count-friend-contact");
});

$(document).ready(function(){

    denyReceivedFriendContact();

    acceptReceivedFriendContact();

    unfriend();
});