/*************************************************************
 * @param {*} quantitySeenNotifications show total notification user have seen
 * this function execute a AJAX request GET to retrieve older notifications
 * old notifications will be appended continually.
 * No more notification if  quantitySeenNotifications > 15
 *************************************************************/
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
        });


        $("#btn-read-more-notifications").css("display","block");
        $(".lds-ring").css("display","none");
    });
}



/*************************************************************
 * listen event click button "read more notification"
 * count <li> tag as seen notifications
 * sent AJAX request to load more older notifications
 *************************************************************/
$(document).ready(function(){

    $("#btn-read-more-notifications").bind("click",function()
    {
        let quantitySeenNotifications = $("ul.list-notifications").find("li").length;
        if(quantitySeenNotifications > 15)
        {
            $("#btn-read-more-notifications").css("display","none");
            $(".lds-ring").css("display","none");
            return false;
        }

        $("#btn-read-more-notifications").css("display","none");
        $(".lds-ring").css("display","inline-block");

        ajaxToRetrieveMoreOldNotification(quantitySeenNotifications);
    });
});