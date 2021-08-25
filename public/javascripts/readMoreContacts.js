/***********************************************
 * handle event click on button "chat"
 ***********************************************/
let clickChatButton = ()=>{
    $(".user-talk").unbind("click").on("click", function(){
        let receiverID = $(this).data("uid");
        let receiverName = $(this).parent().find(".user-name>p").text().trim();
        let receiverAvatar = $(this).parent().find(".user-avatar>img").attr("src");

        /* Step 1 */
        $("div.modal-content").find(".close").click();

        /* Step 2 */
        let contentRight = 
        `<div class="right tab-pane " data-chat="${receiverID}" id="to_${receiverID}">
            <div class="top">
                <span>To:
                    <img src="${receiverAvatar}" class="avatar-small">
                    <span class="name">${receiverName}
                </span>
            </span>
            <span class="chat-menu-right">
                <a href="#attachmentsModal_${receiverID}" class="show-attachments" data-toggle="modal">
                    <i class="fa fa-paperclip">&nbsp; <strong>Files</strong></i>
                </a>
            </span>
            <span class="chat-menu-right">
                <a href="javascript:void(0)">&nbsp;</a>
            </span>
            <span class="chat-menu-right">
                <a href="#imagesModal_${receiverID}" class="show-images" data-toggle="modal">
                    <i class="fa fa-photo">&nbsp; <strong>Media</strong></i>
                </a>
            </span>
        </div>
            <div class="content-chat">
                <div class="chat" data-chat="${receiverID}">
                </div>
            </div>
            <div class="write" data-chat="${receiverID}">
                <input type="text" class="write-chat" id="write-chat-${receiverID}" data-chat="${receiverID}">
                <div class="icons">
                    <a href="#" class="icon-chat" data-chat="${receiverID}"><i class="fa fa-smile-o"></i></a>
                    <label for="image-chat-${receiverID}">
                        <input type="file" id="image-chat-${receiverID}" name="my-image-chat" class="image-chat" data-chat="${receiverID}">
                        <i class="fa fa-photo"></i>
                    </label>
                    <label for="attachment-chat-${receiverID}">
                        <input type="file" id="attachment-chat-${receiverID}" name="my-attachment-chat" class="attachment-chat" data-chat="${receiverID}">
                        <i class="fa fa-paperclip"></i>
                    </label>
                    
                    <a href="javascript:void(0)" id="video-chat" class="video-chat-${receiverID}" data-chat="${receiverID}">
                        <i class="fa fa-video-camera"></i>
                    </a>
                </div>
            </div>
        </div>`;
        $("#chat-screen").prepend(contentRight);
     
        /* Step 3 */
        let contentLeft = 
        `<a href="#uid_${receiverID}" class="room-chat" id="null-contact" data-target="#to_${receiverID}">
            <li class="person active" data-chat="${receiverID}">
                <div class="left-avatar">
                    <div class="dot"></div>
                    <img src="${receiverAvatar}" alt="avatar">
                </div>
                <span class="name">
                    ${receiverName}
                </span>
                <span class="time"></span>
                    <span class="preview convert-emoji">
                            Say "hi" to ${receiverName}
                    </span>
            </li>
        </a>`;
        $("#all-chat").find("ul").prepend(contentLeft).click();

        /* Step 4 */
        let photoModal = 
        `<div class="modal fade" id="imagesModal_${receiverID}" role="dialog">
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




        /* Step 5 */
        let fileModal = 
        `<div class="modal fade" id="attachmentsModal_${receiverID}" role="dialog">
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

        //$(`.person[data-chat="${receiverID}"]`).click();
        selectChatScreen();
    });
}
/***********************************************
 * views/home/section/contact.ejs - line 54
 * @param {*} quantityOfSeenContacts | number | number of contacts that user have seen in their scree
 * @returns |template| friend contacts if user does not see all friends 
 * **********************************************/
let ajaxToRetrieveMoreFriendContacts = (quantityOfSeenFriendContacts)=>{
    $.get(`/read-more-friend-contacts/${quantityOfSeenFriendContacts}`,function(contacts){
            
        if( contacts.length < 0 )
        {
            alertify.notify("No more friend contacts to show !");
            $("#btn-read-more-friend-contacts").css("display","none");
            $(".lds-ring").css("display","none");
            return false;
        }

        contacts.forEach( (element)=>{
            $("#contacts")
            .find("ul")
            .append(`<li class="_contactList" data-uid="${element._id}">
            <div class="contactPanel">
                <div class="user-avatar">
                    <img src="./images/users/${element.avatar}" alt="">
                </div>
                <div class="user-name">
                    <p>
                        ${element.username}
                    </p>
                </div>
                <br>
                <div class="user-address">
                    <span>&nbsp ${ (element.address !== undefined ) ? element.address : "" }</span>
                </div>
                <div class="user-talk" data-uid="${element._id}">
                    Chat
                </div>
                <div class="user-remove-contact action-danger" data-uid="${element._id}">
                    Remove
                </div>
            </div>
        </li>`);
        });

        $("#btn-read-more-friend-contacts").css("display","block");
        $(".lds-ring").css("display","none");

        clickChatButton();
    });
}



/***********************************************
 * views/home/section/contact.ejs - line 88
 * @param {*} quantityOfSeenSentFriendContacts | number | people are sent friend request by user
 * user is waiting for their response
 * @return |template| people who are sent friend request & they does not appear in the screen
 ***********************************************/
let ajaxToRetrieveMoreSentFriendRequestContacts = (quantityOfSeenSentFriendContacts)=>{
    $.get(`/read-more-sent-friend-contacts/${quantityOfSeenSentFriendContacts}`,function(contacts){
            
        if( contacts.length < 0 )
        {
            alertify.notify("No more sent friend request contacts to show !");
            $("#btn-read-more-sent-friend-request-contacts").css("display","none");
            $(".lds-ring").css("display","none");
            return false;
        }

        contacts.forEach( (element)=>{
            $("#request-contact-sent")
            .find("ul")
            .append(`<li class="_contactList" data-uid="${element._id}">
            <div class="contactPanel">
                <div class="user-avatar">
                    <img src="./images/users/${element.avatar}" alt="">
                </div>
                <div class="user-name">
                    <p>
                        ${element.username}
                    </p>
                </div>
                <br>
                <div class="user-address">
                    <span>&nbsp ${(element.address) !== null ? element.address : ""}</span>
                </div>
                <div class="user-remove-request-contact display-important action-danger" data-uid="${element._id}">
                    Cancel Friend Request
                </div>
            </div>
        </li>`);
        });


        $("#btn-read-more-friend-contacts").css("display","block");
        $(".lds-ring").css("display","none");
    });
}



/***********************************************
 * views/home/section/contact.ejs - line 119
 * @param {*} quantityOfSeenReceivedFriendContacts | number | people send friend request to user
 * @returns |template| people sending friend request & does not appear in the screen
 ***********************************************/
let ajaxToRetrieveMoreReceivedFriendContacts = (quantityOfSeenReceivedFriendContacts)=>{
    $.get(`/read-more-received-friend-contacts/${quantityOfSeenReceivedFriendContacts}`,function(contacts){
            
        if( contacts.length < 0 )
        {
            alertify.notify("No more sent friend request contacts to show !");
            $("#btn-read-received-friend-contacts").css("display","none");
            $(".lds-ring").css("display","none");
            return false;
        }

        contacts.forEach( (element)=>{
            $("#request-contact-received")
            .find("ul")
            .append(`<li class="_contactList" data-uid="${element._id}">
            <div class="contactPanel">
                <div class="user-avatar">
                    <img src="./images/users/${element.avatar}" alt="">
                </div>
                <div class="user-name">
                    <p>
                        ${element.username}
                    </p>
                </div>
                <br>
                <div class="user-address">
                    <span>&nbsp ${(element.address) !== null ? element.address : ""}</span>
                </div>
                <div class="user-accept-contact-received " data-uid="${element._id}">
                    Accept
                </div>
                <div class="user-reject-request-contact-received action-danger" data-uid="${element._id}">
                    Refuse
                </div>
            </div>
        </li>`);
        });
        denyReceivedFriendContact();
        acceptReceivedFriendContact();
        $("#btn-read-received-friend-contacts").css("display","block");
        $(".lds-ring").css("display","none");
    });
}



/***********************************************
 * handleEventClickReadMoreFriendContacts listen event click "read more friend contacts"
 ***********************************************/
let handleEventClickReadMoreFriendContacts = ()=>{
    $("#btn-read-more-friend-contacts").bind("click",function()
    {
        let quantityOfSeenFriendContacts = $("#contacts").find("li").length;
        if(quantityOfSeenFriendContacts > 15)
        {
            $("#btn-read-more-friend-contacts").css("display","none");
            $(".lds-ring").css("display","none");
            return false;
        }

        $("#btn-read-more-friend-contacts").css("display","none");
        $(".lds-ring").css("display","inline-block");

        ajaxToRetrieveMoreFriendContacts(quantityOfSeenFriendContacts);
        unfriend();
    });
}



/***********************************************
 * handleEventClickReadMoreSentFriendContacts listen event click "read more sent friend request contacts"
 ***********************************************/
let handleEventClickReadMoreSentFriendContacts = ()=>{
    $("#btn-read-more-sent-friend-request-contacts").bind("click",function(){
        let quantityOfSeenSentFriendContacts = $("#request-contact-sent").find("li").length;
        if(quantityOfSeenSentFriendContacts > 15)
        {
            $("#btn-read-more-sent-friend-request-contacts").css("display","none");
            $(".lds-ring").css("display","none");
            return false;
        }

        $("#btn-read-more-sent-friend-request-contacts").css("display","none");
        $(".lds-ring").css("display","inline-block");

        ajaxToRetrieveMoreSentFriendRequestContacts(quantityOfSeenSentFriendContacts);
    })
}



/***********************************************
 * handleEventClickReadMoreReceivedFriendContacts listen event click "read more received friend request contacts"
 ***********************************************/
let handleEventClickReadMoreReceivedFriendContacts = ()=>{
    $("#btn-read-received-friend-contacts").bind("click" , function(){
        let quantityOfSeenReceivedFriendContacts = $("#request-contact-received").find("li").length;

        $("#btn-read-received-friend-contacts").css("display","none");
        $(".lds-ring").css("display","inline-block");
        ajaxToRetrieveMoreReceivedFriendContacts( quantityOfSeenReceivedFriendContacts );
    });
}



$(document).ready(function(){

    handleEventClickReadMoreFriendContacts();

    handleEventClickReadMoreSentFriendContacts();

    handleEventClickReadMoreReceivedFriendContacts(); 
});