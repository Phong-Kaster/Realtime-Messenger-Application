function addFriendsToGroup(){
    $('ul#group-chat-friends').find('div.add-user').bind('click', function() {
      let uid = $(this).data('uid');
      $(this).remove();
      let html = $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').html();
  
      let promise = new Promise(function(resolve, reject) {
        $('ul#friends-added').append(html);
        $('#groupChatModal .list-user-added').show();
        resolve(true);
      });
      
      promise.then(function(success) {
        $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').remove();
      });
    });
}



function handleEventCancelCreateGroupChat(){
    $('#btn-cancel-group-chat').bind('click', function() {
      $('#groupChatModal .list-user-added').hide();
      if ($('ul#friends-added>li').length) {
        $('ul#friends-added>li').each(function(index) {
          $(this).remove();
        });
      }
    });
}



function ajaxToCreateGroupChat( friendIDs , groupChatName ){
  $.post("/create-group-chat", { friendIDs , groupChatName } , function(data){
      console.log(data);
  });
}



function handleEventCreateGroup(){
  $("#btn-create-group-chat").bind("click", function()
  {
      let quantityAddedFriend = $("ul#friends-added").find("li").length;
      if( quantityAddedFriend < 2)
      {
          alertify.notify("Group chat must have at least 3 people !", "error" , 7);
          return false;
      }



      let groupChatName = $("#name-group-chat").val();
      let regexGroupChatName = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
      if( !groupChatName.length )
      {
          alertify.notify("Name must have at least 1 letter !", "error" , 7);
          return false;
      }
      if( !regexGroupChatName.test(groupChatName))
      {
          alertify.notify("Name should not have had special letter like @, #, $...","error",7);
          return false;
      }

       

      let friendIDs = [];
      $("ul#friends-added").find("li").each( (index , element)=>{
          friendIDs.push( {"userId": $(element).data("uid")} );
      });


      // show a notification asks user if they are sure ?
      Swal.fire({
        title: `Are you sure to create &nbsp; <span style="color: #0077ff"> ${groupChatName} </span>?`,
        icon: "information",
        showCancelButton: true,
        confirmButtonColor: '#0078FF',
        cancelButtonColor: '#d33',
        confirmButtonText: "Yes",
        cancelButtonText: "No"
      }).then((result) => {
            // if cancel then empty everything
            if( !result.value ){
                return false;
            }
            ajaxToCreateGroupChat( friendIDs , groupChatName );
      });
  });
}



/************************************************************************
 * @param {*} event.which | For key or mouse events, this property indicates the specific key or button that was pressed.
 * @param {*} event.type | Describes the nature of the event.
 * @returns a get AJAX request to server
 ************************************************************************/
function searchFriend(event){
    let keyword = $("#input-search-friend-to-add-group-chat").val();
    let regexUsername = /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/;
    
    
    if( event.which === 13 || event.type === "click" )
    {
        if( keyword.length < 0)
        {
            alertify.notify("You have to type a username" , "error" , 7);
            return false;
        }

        if( !regexUsername.test(keyword) )
        {
            alertify.notify("Username can not contain special letter" , "error" , 7);
            return false;
        }
        
        $.get(`search-friend/${keyword}` , function(data){
            $("#group-chat-friends").html(data);

            addFriendsToGroup();
            handleEventCancelCreateGroupChat();
        });
    }
}




$(document).ready(function(){
    $("#btn-search-friend-to-add-group-chat").bind("click" , searchFriend);

    handleEventCreateGroup();
});