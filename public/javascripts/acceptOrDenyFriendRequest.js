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
 * 
 * Step 9 -> Step 13: Create a new conversation left|right tab if user wanna chat immediately
 * Step 9 : Close contact management modal
 * Step 10 : move the new conversation to the top
 * Step 11 : Create a new chat screen
 * Step 12 & Step 13 : Create a new shared file | media modal
 ************************************************************/
let acceptReceivedFriendContact = ()=>{
    $(".user-acccept-contact-received").bind("click", function(){
        /* Step 1 */
        let senderID = $(this).data("uid");
        let senderName = $(this).parent().find("div.user-name>p").text();
        let senderAvatar = $(this).parent().find("div.user-avatar>img").attr("src");
        
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
                                        Chat 
                                </div>
                                <div class="user-remove-contact action-danger" data-uid="${senderID}">
                                        Remove
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

                    /* Step 9 */
                    $(".modal-content").find(".close").click();

                    /* Step 10 */
                    let senderLeftTab = 
                    `<a href="#uid_${senderID}" class="room-chat" id="null-contact" data-target="#to_${senderID}">
                    <li class="person active" data-chat="${senderID}">
                        <div class="left-avatar">
                            <div class="dot"></div>
                            <img src="${senderAvatar}" alt="avatar">
                        </div>
                        <span class="name">
                            ${senderName}
                        </span>
                        <span class="time"></span>
                            <span class="preview convert-emoji">
                                Say "hi" to ${senderName}
                            </span>
                        </li>
                    </a>`;
                    $("#all-chat").find("ul").prepend(senderLeftTab);
                    $("#personal-chat").find("ul").prepend(senderLeftTab);

                    /* Step 11 */
                    let senderRightTab = 
                    `<div class="right tab-pane" data-chat="${senderID}" id="to_${senderID}">
                        <div class="top">
                            <span>To:
                                <img src="${senderAvatar}" class="avatar-small">
                                <span class="name">${senderName}
                            </span>
                        </span>
                            <span class="chat-menu-right">
                                <a href="#attachmentsModal_${senderID}" class="show-attachments" data-toggle="modal">
                                    <i class="fa fa-paperclip">&nbsp; <strong>Files</strong></i>
                                </a>
                            </span>
                            <span class="chat-menu-right">
                                <a href="javascript:void(0)">&nbsp;</a>
                            </span>
                            <span class="chat-menu-right">
                                <a href="#imagesModal_${senderID}" class="show-images" data-toggle="modal">
                                    <i class="fa fa-photo">&nbsp; <strong>Media</strong></i>
                                </a>
                            </span>
                        </div>
                        <div class="content-chat">
                            <div class="chat" data-chat="${senderID}">
                            </div>
                        </div>
                            <div class="write" data-chat="${senderID}">
                                <input type="text" class="write-chat" id="write-chat-${senderID}" data-chat="${senderID}">
                                <div class="icons">
                                    <a href="#" class="icon-chat" data-chat="${senderID}"><i class="fa fa-smile-o"></i></a>
                                    <label for="image-chat-${senderID}">
                                        <input type="file" id="image-chat-${senderID}" name="my-image-chat" class="image-chat" data-chat="${senderID}">
                                        <i class="fa fa-photo"></i>
                                    </label>
                                    <label for="attachment-chat-${senderID}">
                                        <input type="file" id="attachment-chat-${senderID}" name="my-attachment-chat" class="attachment-chat" data-chat="${senderID}">
                                        <i class="fa fa-paperclip"></i>
                                    </label>
                                    
                                    <a href="javascript:void(0)" id="video-chat" class="video-chat-${senderID}" data-chat="${senderID}">
                                        <i class="fa fa-video-camera"></i>
                                    </a>

                                    <!-- <input type="hidden" id="peer-id" value=""> -->
                                </div>
                            </div>
                    </div>`;
                    $("#chat-screen").prepend(senderRightTab);
                    selectChatScreen();

                    /* Step 12 */
                    let photoModal = 
                    `<div class="modal fade" id="imagesModal_${senderID}" role="dialog">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title">Shared Media</h4>
                                </div>
                                <div class="modal-body">
                                    <div class="all-images" style="visibility:visible;">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    $("body").append(photoModal);
                    gridPhotos(5);

                    /* Step 13 */
                    let fileModal = 
                    `<div class="modal fade" id="attachmentsModal_${senderID}" role="dialog">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title">Shared Files</h4>
                                </div>
                                <div class="modal-body">
                                    <ul class="list-attachments">
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    $("body").append(fileModal);
                }
            }
        })
            
    });
}

/************************************************************
 * @param {*} receiverID | string | whom user unfriend
 * listen event click unfriend button & send a DELETE request
 * views/home/section/contact.ejs - line 75
 * 
 * Step 1 : remove the tab in friend contact 
 * Step 2 : update number of friends
 * Step 3 : remove the left conversation tab
 * Step 4 : remove the right conversation tab
 * Step 5 : remove media modal where stores all shared photos
 * Step 6 : remove file modal where stores all shared files
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
                

                /* Step 3 */
                $("#all-chat").find(`ul a[data-target="#to_${receiverID}"]`).remove();
                $("#personal-chat").find(`ul a[data-target="#to_${receiverID}"]`).remove();

                /* Step 4 */
                $("#chat-screen").find(`div#to_${receiverID}`).remove();

                /* Step 5 */
                $("body").find(`div#imagesModal_${receiverID}`).remove();

                /* Step 6 */
                $("body").find(`div#attachmentsModal_${receiverID}`).remove();
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
            confirmButtonColor: '#0078FF',
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
 * 
 * Step 6 -> Step 9: Create a new conversation left|right tab if user wanna chat immediately
 * Step 6 : move the new conversation to the top
 * Step 7 : Create a new chat screen
 * Step 8 & 9 : Create a new shared file | media modal
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
                Chat
            </div>
            <div class="user-remove-contact action-danger" data-uid="${sender.id}">
                Remove
            </div>
        </div>
    </li>`;

    $("#contact").find("ul").prepend(friendTab);


    /* Step 6 */
    let friendLeftTab = 
    `<a href="#uid_${sender.id}" class="room-chat" id="null-contact" data-target="#to_${sender.id}">
    <li class="person active" data-chat="${sender.id}">
        <div class="left-avatar">
            <div class="dot"></div>
            <img src="./images/users/${sender.avatar}" alt="avatar">
        </div>
        <span class="name">
            ${sender.username}    
        </span>
        <span class="time"></span>
            <span class="preview convert-emoji">
                Say "hi" to  ${sender.username}
            </span>
        </li>
    </a>`;
    $("#all-chat").find("ul").prepend(friendLeftTab);
    $("#personal-chat").find("ul").prepend(friendLeftTab);

    /* Step 7 */
    let friendRightTab = 
    `<div class="right tab-pane" data-chat="${sender.id}" id="to_${sender.id}">
        <div class="top">
            <span>To:
                <img src="./images/users/${sender.avatar}" class="avatar-small">
                <span class="name">${sender.username}
            </span>
        </span>
            <span class="chat-menu-right">
                <a href="#attachmentsModal_${sender.id}" class="show-attachments" data-toggle="modal">
                    <i class="fa fa-paperclip">&nbsp; <strong>Files</strong></i>
                </a>
            </span>
            <span class="chat-menu-right">
                <a href="javascript:void(0)">&nbsp;</a>
            </span>
            <span class="chat-menu-right">
                <a href="#imagesModal_${sender.id}" class="show-images" data-toggle="modal">
                    <i class="fa fa-photo">&nbsp; <strong>Media</strong></i>
                </a>
            </span>
        </div>
        <div class="content-chat">
            <div class="chat" data-chat="${sender.id}">
            </div>
        </div>
            <div class="write" data-chat="${sender.id}">
                <input type="text" class="write-chat" id="write-chat-${sender.id}" data-chat="${sender.id}">
                <div class="icons">
                    <a href="#" class="icon-chat" data-chat="${sender.id}"><i class="fa fa-smile-o"></i></a>
                    <label for="image-chat-${sender.id}">
                        <input type="file" id="image-chat-${sender.id}" name="my-image-chat" class="image-chat" data-chat="${sender.id}">
                        <i class="fa fa-photo"></i>
                    </label>
                    <label for="attachment-chat-${sender.id}">
                        <input type="file" id="attachment-chat-${sender.id}" name="my-attachment-chat" class="attachment-chat" data-chat="${sender.id}">
                        <i class="fa fa-paperclip"></i>
                    </label>
                    
                    <a href="javascript:void(0)" id="video-chat" class="video-chat-${sender.id}" data-chat="${sender.id}">
                        <i class="fa fa-video-camera"></i>
                    </a>

                    <!-- <input type="hidden" id="peer-id" value=""> -->
                </div>
            </div>
    </div>`;
    $("#chat-screen").prepend(friendRightTab);
    selectChatScreen();

    /* Step 8 */
    let photoModal = 
    `<div class="modal fade" id="imagesModal_${sender.id}" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Shared Media</h4>
                </div>
                <div class="modal-body">
                    <div class="all-images" style="visibility:visible;">
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    $("body").append(photoModal);
    gridPhotos(5);

    /* Step 9 */
    let fileModal = 
    `<div class="modal fade" id="attachmentsModal_${sender.id}" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Shared Files</h4>
                </div>
                <div class="modal-body">
                    <ul class="list-attachments">
                    </ul>
                </div>
            </div>
        </div>
    </div>`;
    $("body").append(fileModal);
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

    /* Step 4 */
    $("#all-chat").find(`ul a[data-target="#to_${sender.id}"]`).remove();
    $("#personal-chat").find(`ul a[data-target="#to_${sender.id}"]`).remove();

    /* Step 5 */
    $("#chat-screen").find(`div#to_${sender.id}`).remove();

    /* Step 6 */
    $("body").find(`div#imagesModal_${sender.id}`).remove();

    /* Step 7 */
    $("body").find(`div#attachmentsModal_${sender.id}`).remove();
});

$(document).ready(function(){

    denyReceivedFriendContact();

    acceptReceivedFriendContact();

    unfriend();
});