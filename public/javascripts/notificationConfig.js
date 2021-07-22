let ajaxToRetrieveMoreOldNotification = (quantitySeenNotifications)=>{
    $.get(`/notification-read-more/${quantitySeenNotifications}`,function(oldNotifications){
            
        if( oldNotifications.length < 0 )
        {
            alertify.notify("No more notifications to show !");
            $("#btn-read-more-notifications").css("display","block");
            $(".lds-ring").css("display","none");
            return false;
        }


        oldNotifications.forEach( (element)=>{
            $("ul.list-notifications").append(`<li>${element}</li>`);
        })
        $("#btn-read-more-notifications").css("display","block");
        $(".lds-ring").css("display","none");

    });
}

$(document).ready(function(){

    $("#btn-read-more-notifications").bind("click",function()
    {
        let quantitySeenNotifications = $("ul.list-notifications").find("li").length;

        // if(quantitySeenNotifications > 10)
        // {
        //     $("#btn-read-more-notifications").css("display","none");
        //     $(".lds-ring").css("display","none");
        // }

        $("#btn-read-more-notifications").css("display","none");
        $(".lds-ring").css("display","inline-block");

        ajaxToRetrieveMoreOldNotification(quantitySeenNotifications);
    });
});