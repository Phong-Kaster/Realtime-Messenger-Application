/***********************************************
 * @param {*} quantityOfSeenContacts | number | number of contacts that user have seen in their scree
 ***********************************************/
let ajaxToRetrieveMoreFriendContacts = (quantityOfSeenFriendContacts)=>{
    $.get(`/read-more-friend-contacts/${quantityOfSeenFriendContacts}`,function(contacts){
            
        if( contacts.length < 0 )
        {
            alertify.notify("No more contacts to show !");
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
                    Trò chuyện
                </div>
                <div class="user-remove-contact action-danger" data-uid="${element._id}">
                    Xóa liên hệ
                </div>
            </div>
        </li>`);
        });


        $("#btn-read-more-friend-contacts").css("display","block");
        $(".lds-ring").css("display","none");
    });
}

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
                <div class="user-remove-request-sent action-danger" data-uid="${element._id}">
                    Hủy yêu cầu
                </div>
            </div>
        </li>`);
        });


        $("#btn-read-more-friend-contacts").css("display","block");
        $(".lds-ring").css("display","none");
    });
}

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
                <div class="user-acccept-contact-received" data-uid="${element._id}">
                    Chấp nhận
                </div>
                <div class="user-reject-request-contact-received action-danger" data-uid="${element._id}">
                    Xóa yêu cầu
                </div>
            </div>
        </li>`);
        });


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