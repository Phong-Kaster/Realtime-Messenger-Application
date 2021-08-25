/**************************************************
 * @param {*} quantityIndividualTab | number | quantity of individual conversation which appears in the screen
 * @param {*} quantityGroupTab | number | quantity of group conversation which appears in the screen
 **************************************************/
let ajaxToRetrieveMoreConversationAllChat = ( quantityIndividualTab , quantityGroupTab )=>{
    $.get(`/read-more-conversation-all-chat/${quantityIndividualTab}/${quantityGroupTab}` , function(data){

        $("#btn-read-more-all-chat").css("display","inline-block");
        $(".lds-ring").css("display","none");
        if( !data )
        {
            alertify.notify("No more conversation to show", "error" , 7);
            return false;
        }
        $("#all-chat").find("ul").append( data.contentLeft );
        nineScrollLeft();
        nineScrollLeftResize();


        $("#chat-screen").append( data.contentRight );
        selectChatScreen();


        $("body").append( data.photoModal );
        $("body").append( data.documentModal );
    });
}

/**************************************************
 * @quantityIndividualTab | number | quantity of individual conversation on left-side
 * @quantityIndividualTab | number | quantity of group conversation on left-side
 * 
 * Step 1 : retrieve quantity of individual | group conversation tab
 * Step 2 : activate loading animation
 * Step 3 : send a get AJAX request to server
 **************************************************/
let handleEventClickReadMoreConversationAllChat= ()=>{
    $("#btn-read-more-all-chat").bind("click", function(){
        /* Step 1 */
        let quantityIndividualTab = $("#all-chat").find("li:not(.group-chat)").length;
        let quantityGroupTab = $("#all-chat").find("li.group-chat").length;
        
        
        /* Step 2 */
        $("#btn-read-more-all-chat").css("display","none");
        $(".lds-ring").css("display","inline-block");

        /* Step 3 */
        ajaxToRetrieveMoreConversationAllChat( quantityIndividualTab , quantityGroupTab );
    });
}

$(document).ready(function(){
    handleEventClickReadMoreConversationAllChat();
    
});