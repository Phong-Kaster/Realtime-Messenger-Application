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
                    <span>&nbsp ${(element.address) !== null ? element.address : ""}</span>
                </div>
                <div class="user-talk" data-uid="${element._id}">>
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
                <div class="user-acccept-contact-received " data-uid="${element._id}">
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