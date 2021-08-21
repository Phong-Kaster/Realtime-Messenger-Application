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



function cancelCreateGroup(){
    $('#cancel-group-chat').bind('click', function() {
      $('#groupChatModal .list-user-added').hide();
      if ($('ul#friends-added>li').length) {
        $('ul#friends-added>li').each(function(index) {
          $(this).remove();
        });
      }
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
            cancelCreateGroup();
        });
    }
}

$(document).ready(function(){
    $("#btn-search-friend-to-add-group-chat").bind("click" , searchFriend);
});