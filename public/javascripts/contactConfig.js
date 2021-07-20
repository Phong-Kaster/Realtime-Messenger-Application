/************************************************************
 * increaseResultNumber & decreaseResultNumber are 2 functions that interact with DOM Object
 * @param {*} className that <div> name that is changed value of number
 * @value is the value that <div> tag will be changed
 * @returns the latest value bases on action in contact management
 ************************************************************/
function increaseResultNumber(className){

    let value =  +$(`.${className}`).find("strong").text();
    value = value+1;
    
    if(value === 0)
    {
        +$(`.${className}`).html(null);
    }
    +$(`.${className}`).html(`(<strong>${value}</strong>)`);
}
function decreaseResultNumber(className){
    let value = $(`.${className}`).find("strong").text();
    value--;

    if( value === 0)
    {
        $(`.${className}`).html(null);
    }
    
    $(`.${className}`).html( (`(<strong>${value}</strong>)`) ) ;
}



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
            }
        })
    })
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
            },
            error : function(error)
            {
                console.log(error);
            }
        })
    })
}

/* check input is username which is being searching valid or not ?  */
function search(element){

    let keyword = $("#keyword").val();
    let regexUsername = /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/;
    

    // 13 is Key-code of Enter
    if(element.which === 13 || element.type === "click")
    {
        if( keyword.length < 0)
        {
            alertify.alert().set('message', 'Your gender must write a username or e-mail').show();
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