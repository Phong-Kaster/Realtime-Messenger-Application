/************************************************************
 * handle event in /views/home/section/notification.ejs - line 13
 * handle event click "mark as read" in navbar.ejs - line 54
 * @param {*} senderIDs 
 ************************************************************/
function ajaxToMarkUnseenNotificationsAsRead(senderIDs)
{
    $.ajax({
        url: "/notification-mark-as-read",
        type: "put",
        data: { senderIDs : senderIDs },
        success: function(result)
        {
            if( result ){

                senderIDs.forEach( (element)=>{
                    $(".noti_content").find(`span[data-uid = ${element}]`).removeClass("unseen-notification");
                    $("ul.list-notifications").find(`li>span[data-uid = ${element}]`).removeClass("unseen-notification");
                });
                decreaseNotificationNumber("noti_content" , senderIDs.length);
            }
        }
    })
}



/************************************************************
 * listen event click "mark as read" in navbar.ejs - line 54
 * @senderIDs is an array that contain ID which senders make request
 ************************************************************/
function handleEventMarkAsReadIcon(){
    $("#mark-as-read").bind("click" , function(){
        let senderIDs = [];
        let unseenNotifications = $(".noti_content").find("span.unseen-notification");

        unseenNotifications.each(function(index,element){
            let ID = $(element).data("uid");
            senderIDs.push( ID );
        });

        if( !senderIDs.length ){
            return false;
        }
        ajaxToMarkUnseenNotificationsAsRead(senderIDs);
    });

}



/************************************************************
 * listen event click "mark as read" in views/home/section/notification.ejs - line 9
 * @senderIDs is an array that contain ID which senders make request
 ************************************************************/
function handleEventMarkAsReadModel(){
    $("#modal-mark-as-read").bind("click" , function(){
        let senderIDs = [];
        let unseenNotifications = $("ul.list-notifications").find("li>span.unseen-notification");

        unseenNotifications.each(function(index,element){
            let ID = $(element).data("uid");
            senderIDs.push( ID );
        })

        if( !senderIDs.length ){
            return false;
        }
        ajaxToMarkUnseenNotificationsAsRead(senderIDs);
    });
}



$(document).ready(function(){
    handleEventMarkAsReadIcon();
    
    handleEventMarkAsReadModel();
});