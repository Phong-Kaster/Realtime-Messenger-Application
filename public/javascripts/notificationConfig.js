// let ajaxToReadMoreNotifications = (QuantityOfNotifications)=> {
//     $.get(`/notification-read-more?quantityNotification=${QuantityOfNotifications}`,(notification)=>{
//         console.log(notification);
//     });
// }

$(document).ready(function(){

    $("#btn-read-more-notifications").bind("click",function()
    {
        let quantitySeenNotifications = $("ul.list-notifications").find("li").length;

        $.get(`/notification-read-more/${quantitySeenNotifications}`,function(oldNotifications){
            
            if( oldNotifications.length < 0 )
            {
                alertify.notify("No more notifications to show !");
                //alertify.alert().set('message', 'No more notifications to show !').show();
            }


            oldNotifications.forEach( (element)=>{
                $("ul.list-notifications").append(`<li>${element}</li>`);
            })

        });
    });
});