let ajaxToRetrieveMoreContacts = (quantityOfSeenContacts)=>{
    $.get(`/read-more-friend-contacts/${quantityOfSeenContacts}`,function(contacts){
            
        if( contacts.length < 0 )
        {
            alertify.notify("No more contacts to show !");
            $("#btn-read-more-friend-contacts").css("display","block");
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



$(document).ready(function(){

    $("#btn-read-more-friend-contacts").bind("click",function()
    {
        let quantityOfSeenContacts = $("#contacts").find("li").length;
        if(quantityOfSeenContacts > 15)
        {
            $("#btn-read-more-friend-contacts").css("display","none");
            $(".lds-ring").css("display","none");
            return false;
        }

        $("#btn-read-more-friend-contacts").css("display","none");
        $(".lds-ring").css("display","inline-block");

        ajaxToRetrieveMoreContacts(quantityOfSeenContacts);
    });
});