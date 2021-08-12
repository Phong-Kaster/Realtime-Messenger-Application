const socket = io();


function nineScrollLeft() {
  $('.left').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
}

function nineScrollRight(dataChat) {
  $(`.right .chat[data-chat = ${dataChat}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
  $(`.right .chat[data-chat = ${dataChat}]`).scrollTop($(`.right .chat[data-chat = ${dataChat}]`)[0].scrollHeight);
}

function enableEmojioneArea(dataChat) {
  $(`#write-chat-${dataChat}`).emojioneArea({
    standalone: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      keyup: function(editor, event) {
        $(`#write-chat-${dataChat}`).val(this.getText());
      }
    },
  });
  $('.icon-chat').bind('click', function(event) {
    event.preventDefault();
    $('.emojionearea-button').click();
    $('.emojionearea-editor').focus();
  });
}

function spinLoaded() {
  $('#loader').css('display', 'none');
}

function spinLoading() {
  $('#loader').css('display', 'block');
}

function ajaxLoading() {
  $(document)
    .ajaxStart(function() {
      spinLoading();
    })
    .ajaxStop(function() {
      spinLoaded();
    });
}

function showModalContacts() {
  $('#show-modal-contacts').click(function() {
    $(this).find('.noti_contact_counter').fadeOut('slow');
  });
}

function configNotification() {
  $('#noti_Button').click(function() {
    $('#notifications').fadeToggle('fast', 'linear');
    $('.noti_counter').fadeOut('slow');
    return false;
  });
  $(".main-content").click(function() {
    $('#notifications').fadeOut('fast', 'linear');
  });
}

function gridPhotos(layoutNumber) {
  $(".show-images").unbind("click").on("click", function(){
    let href = $(this).attr("href");// input: #imagesModal_60f922515b66641d989a4f5b
    let modalID = href.replace("#","");// output: imagesModal_60f922515b66641d989a4f5b

    let countRows = Math.ceil($(`${modalID}`).find('div.all-images>img').length / layoutNumber);
    let layoutStr = new Array(countRows).fill(layoutNumber).join("");

    $(`${modalID}`).find('div.all-images').photosetGrid({
        highresLinks: true,
        rel: 'withhearts-gallery',
        gutter: '2px',
        layout: layoutStr,
        onComplete: function() {
          $(`${modalID}`).find('.all-images').css({
            'visibility': 'visible'
          });
          $(`${modalID}`).find('.all-images a').colorbox({
            photo: true,
            scalePhotos: true,
            maxHeight: '90%',
            maxWidth: '90%'
          });
        }
      });
  });

  
}

// function showButtonGroupChat() {
//   $('#select-type-chat').bind('change', function() {
//     if ($(this).val() === 'group-chat') {
//       $('.create-group-chat').show();
//       // Do something...
//     } else {
//       $('.create-group-chat').hide();
//     }
//   });
// }

function addFriendsToGroup() {
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

function cancelCreateGroup() {
  $('#cancel-group-chat').bind('click', function() {
    $('#groupChatModal .list-user-added').hide();
    if ($('ul#friends-added>li').length) {
      $('ul#friends-added>li').each(function(index) {
        $(this).remove();
      });
    }
  });
}

function flashNotice()
{
  let notify = $(".master-success-message").text();
  if(notify.length)
  {
    alertify.notify(notify, "success",7 );
  }
}

function selectTypeConversation()
{
  $("#select-type-chat").bind("change", function(){
    let option = $("option:selected" , this);
    option.tab("show");

    if( $(this).val() == "personal-chat")
    {
      $(".create-group-chat").hide();
    }
    else
    {
      $(".create-group-chat").show();
    }
  });
}

function selectChatScreen()
{
  $(".room-chat").unbind("click").on("click",function(){
    $(".person").removeClass("active");
    $(this).find("li").addClass("active");
    $(this).tab("show");

    let dataChat = $(this).find("li").data("chat");
    nineScrollRight(dataChat);

    // call button emoji
    enableEmojioneArea(dataChat);
  });
}

$(document).ready(function() {
  // Hide số thông báo trên đầu icon mở modal contact
  showModalContacts();

  // Bật tắt popup notification
  configNotification();

  // Cấu hình thanh cuộn
  nineScrollLeft();

  

  // Icon loading khi chạy ajax
  ajaxLoading();

  // Hiển thị button mở modal tạo nhóm trò chuyện
  //showButtonGroupChat();

  // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
  // Tham số chỉ được phép trong khoảng từ 1 đến 5
  gridPhotos(5);

  // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
  addFriendsToGroup();

  // Action hủy việc tạo nhóm trò chuyện
  cancelCreateGroup();

  // pop up notice
  flashNotice();

  // select type conversation: all - personal - group
  selectTypeConversation();

  // select chat conversation screen
  selectChatScreen();

  //alway click first friend contact - views/home/section/contentLeft.ejs
  $("ul.people").find("li").first().click();
});
