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


/*********************************************
 * @param {*} friendIDs | array | contains IDs whose is added to a group chat
 * @param {*} groupChatName | string | name of the group chat
 * Step 1 : hide group modal after posting AJAX request successfully
 *********************************************/
function ajaxToCreateGroupChat( friendIDs , groupChatName ){
  $.post("/create-group-chat", { friendIDs , groupChatName } , function(data){

      /* Step 1 */
      $("#name-group-chat").val("");
      $("#btn-cancel-group-chat").click();
      $(".modal-content").find(".close").click();



      /* Step 2 */
      let groupName = ( data.group.name.length > 15) ? (data.group.name.substr(0,15).concat(".....")) : (data.group.name);
      let groupLeftTab = 
      `<a href="#uid_${data.group._id}" class="room-chat" data-target="#to_${data.group._id}">
        <li class="person group-chat" data-chat="${data.group._id}">
            <div class="left-avatar">
                <!-- <div class="dot"></div> -->
                <img src="./images/users/groupChat.png" alt="avatar">
            </div>
            <span class="name">
                <span class="group-chat-name">
                    ${groupName}
                </span>
            </span>
            <span class="time"> </span>
            <span class="preview convert-emoji">
                    Say "hi" to group "${data.group.name}"
            </span>
        </li>
      </a>`;
      $("#all-chat").find("ul").prepend(groupLeftTab);
      $("#group-chat").find("ul").prepend(groupLeftTab);



      /* Step 3 */
      let groupRightTab = 
        `<div class="right tab-pane" data-chat="${data.group._id}" id="to_${data.group._id}">
            <div class="top">
                <span>To:
                    <img src="./images/users/groupChat.png" class="avatar-small" alt="avatar">
                    <span class="name">${data.group.name}</span>
                </span>
                <span class="chat-menu-right">
                    <a href="#attachmentsModal_${data.group._id}" class="show-attachments" data-toggle="modal">
                        <i class="fa fa-paperclip">&nbsp; <strong>Files</strong></i>
                    </a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)">&nbsp;</a>
                </span>
                <span class="chat-menu-right">
                    <a href="#imagesModal_${data.group._id}" class="show-images" data-toggle="modal">
                        <i class="fa fa-photo">&nbsp; <strong>Media</strong></i>
                    </a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)">&nbsp;</a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)" class="show-images" data-toggle="modal" title="there are ${data.group.member.length} people in this conversation">
                        <i class="fa fa-users" aria-hidden="true">&nbsp;: <strong>${data.group.member.length}</strong></i>
                    </a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)">&nbsp;</a>
                </span>
            </div>
            <div class="content-chat">
                <div class="chat" data-chat="${data.group._id}">
                </div>
            </div>
            <div class="write" data-chat="${data.group._id}">
                <input type="text" class="write-chat group" id="write-chat-${data.group._id}" data-chat="${data.group._id}">
                <div class="icons">
                    <a href="#" class="icon-chat" data-chat="${data.group._id}"><i class="fa fa-smile-o"></i></a>
                    <label for="image-chat-${data.group._id}">
                        <input type="file" id="image-chat-${data.group._id}" name="my-image-chat" class="image-chat chat-in-group" data-chat="${data.group._id}">
                        <i class="fa fa-photo"></i>
                    </label>
                    <label for="attachment-chat-${data.group._id}">
                        <input type="file" id="attachment-chat-${data.group._id}" name="my-attachment-chat" class="attachment-chat chat-in-group" data-chat="${data.group._id}">
                        <i class="fa fa-paperclip"></i>
                    </label> 
                </div>
            </div>
        </div>`;
      $("#chat-screen").prepend(groupRightTab);
      selectChatScreen();



      /* Step 4 */
      let photoModal = 
        `<div class="modal fade" id="imagesModal_${data.group._id}" role="dialog">
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
        `<div class="modal fade" id="attachmentsModal_${data.group._id}" role="dialog">
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

    /* Step 6 */
    socket.emit("create-group-chat", data.group);

  }).fail(function(error)
  {
    alertify.notify(error.responseJSON[0], "error" , 7);
  });
}


/*********************************************
 * handle Event Create Group - handle event "create" group chat
 * Step 1 : check quantity of added friends
 * Step 2 : check name of the group
 * Step 3 : pass added friend's IDs to an array
 * Step 4 : Pop up a notification to confirm user's choice & send a post JAX to complete
 *********************************************/
function handleEventCreateGroup(){
  $("#btn-create-group-chat").bind("click", function()
  {
      /* Step 1 */
      let quantityAddedFriend = $("ul#friends-added").find("li").length;
      if( quantityAddedFriend < 2)
      {
          alertify.notify("Group chat must have at least 3 people !", "error" , 7);
          return false;
      }


      /* Step 2 */
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

       
      /* Step 3 */
      let friendIDs = [];
      $("ul#friends-added").find("li").each( (index , element)=>{
          friendIDs.push( {"userId": $(element).data("uid")} );
      });


      /* Step 4 */
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

    /* do the same as ajaxToCreateGroupChat */
    socket.on("response-create-group-chat" , function(returnedData){
      /* Step 1 - restore screen */
      $("#name-group-chat").val("");
      $("#btn-cancel-group-chat").click();
      $(".modal-content").find(".close").click();



      /* Step 2 - auto move the new group to the top */
      let groupName = ( returnedData.name.length > 15) ? (returnedData.name.substr(0,15).concat(".....")) : (returnedData.name);
      let groupLeftTab = 
        `<a href="#uid_${returnedData._id}" class="room-chat" data-target="#to_${returnedData._id}">
            <li class="person group-chat" data-chat="${returnedData._id}">
                <div class="left-avatar">
                    <!-- <div class="dot"></div> -->
                    <img src="./images/users/groupChat.png" alt="avatar">
                </div>
                <span class="name">
                    <span class="group-chat-name">
                        ${groupName}
                    </span>
                </span>
                <span class="time"> </span>
                <span class="preview convert-emoji">
                        Say "hi" to group "${returnedData.name}"
                </span>
            </li>
        </a>`;
      $("#all-chat").find("ul").prepend(groupLeftTab);
      $("#group-chat").find("ul").prepend(groupLeftTab);



      /* Step 3 - create a new html for the new group*/
      let groupRightTab = 
        `<div class="right tab-pane" data-chat="${returnedData._id}" id="to_${returnedData._id}">
            <div class="top">
                <span>To:
                    <img src="./images/users/groupChat.png" class="avatar-small" alt="avatar">
                    <span class="name">${returnedData.name}</span>
                </span>
                <span class="chat-menu-right">
                    <a href="#attachmentsModal_${returnedData._id}" class="show-attachments" data-toggle="modal">
                        <i class="fa fa-paperclip">&nbsp; <strong>Files</strong></i>
                    </a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)">&nbsp;</a>
                </span>
                <span class="chat-menu-right">
                    <a href="#imagesModal_${returnedData._id}" class="show-images" data-toggle="modal">
                        <i class="fa fa-photo">&nbsp; <strong>Media</strong></i>
                    </a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)">&nbsp;</a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)" class="show-images" data-toggle="modal" title="there are ${returnedData.member.length} people in this conversation">
                        <i class="fa fa-users" aria-hidden="true">&nbsp;: <strong>${returnedData.member.length}</strong></i>
                    </a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)">&nbsp;</a>
                </span>
            </div>
            <div class="content-chat">
                <div class="chat" data-chat="${returnedData._id}">
                </div>
            </div>
            <div class="write" data-chat="${returnedData._id}">
                <input type="text" class="write-chat group" id="write-chat-${returnedData._id}" data-chat="${returnedData._id}">
                <div class="icons">
                    <a href="#" class="icon-chat" data-chat="${returnedData._id}"><i class="fa fa-smile-o"></i></a>
                    <label for="image-chat-${returnedData._id}">
                        <input type="file" id="image-chat-${returnedData._id}" name="my-image-chat" class="image-chat chat-in-group" data-chat="${returnedData._id}">
                        <i class="fa fa-photo"></i>
                    </label>
                    <label for="attachment-chat-${returnedData._id}">
                        <input type="file" id="attachment-chat-${returnedData._id}" name="my-attachment-chat" class="attachment-chat chat-in-group" data-chat="${returnedData._id}">
                        <i class="fa fa-paperclip"></i>
                    </label> 
                </div>
            </div>
        </div>`;
      $("#chat-screen").prepend(groupRightTab);
      selectChatScreen();

      /* Step 4 - photo modal for shared photos*/
      let photoModal = 
        `<div class="modal fade" id="imagesModal_${returnedData._id}" role="dialog">
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

      /* Step 5 - file modal for shared files*/
      let fileModal = 
            `<div class="modal fade" id="attachmentsModal_${returnedData._id}" role="dialog">
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

      /* Step 6 - emit event that this member have joined the group*/
      socket.emit("member-join-group-chat" , returnedData._id);
    })
});