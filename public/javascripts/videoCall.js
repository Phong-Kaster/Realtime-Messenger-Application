function handleEventCallVideo(dataChat){
    $(`.video-chat-${dataChat}`).unbind("click").on("click" , function(){
        /* Step 1 */
        let listenerID = $(this).data("chat");
        let callerName = $("#navbar-username").text();

        let emittedData = {
            listenerID : listenerID,
            callerName : callerName
        }

         /* Step 2 */
         /* caller-side request server check listener is online or offline */
         socket.emit("caller-side-check-listener", emittedData );
    });
}

$(document).ready(function(){

    /* Step 1 */
    /* Step 1.1 */
    socket.on("response-caller-side-listener-offline", function(){
        alertify.notify("This user is offline" , "error" , 7 );
    });

    /* Equipped with nothing but an ID, 
    a peer can create a P2P data or media 
    stream connection to a remote peer. */
    let PeerID;
    let peer = new Peer();
    peer.on("open" , function(ID){
        PeerID = ID;
    });
    /* Step 1.2 */
    
    socket.on("response-caller-side-listener-online", function(callInformation){ 
        let listenerName = $("#navbar-username").text();

        let emittedData = {

            callerID   : callInformation.callerID,
            callerName : callInformation.callerName,
            callAvatar : callInformation.callerAvatar,

            listenerID   : callInformation.listenerID,
            listenerName : listenerName,
            listenerPeerID : PeerID
        }
        /* Send Peer ID of listener to server that listener is ready to receive video call */
        socket.emit("listener-side-pass-peer-id-to-server" , emittedData);
    });

    /* Step 2 */
    socket.on("response-listener-side-pass-peer-id-to-server", function(callInformation){
        let emittedData = {

            callerID   : callInformation.callerID,
            callerName : callInformation.callerName,
            callAvatar : callInformation.callerAvatar,

            listenerID   : callInformation.listenerID,
            listenerName : callInformation.listenerName,
            listenerPeerID : callInformation.listenerPeerID
        }
        /* Caller takes a call to listener */
        socket.emit("caller-side-call-listener" , emittedData );

        let timeInterval;
        Swal.fire(
        {
            icon : 'success',
            title : `You are calling &nbsp; <span style="color: #0077ff"> ${callInformation.listenerName}</span> &nbsp;&nbsp;
            <i class="fa fa-volume-control-phone"></i>`,
            html : 
            `   Countdown : <strong style="color: #0077ff;"></strong> seconds </br></br>
                <button class="btn btn-danger" id="cancel-video-call">Cancel</button>
            `,
            backdrop : "rgba(85, 85, 85, 0.4)",
            timer : 30000,
            allowOutsideClick : false,
            onBeforeOpen : ()=>
            {
                $("#cancel-video-call").bind("click", function(){
                    Swal.close();
                    clearInterval(timeInterval);
                    /* Caller change their mind and cancel video call */
                    socket.emit("caller-side-cancel-call-listener", emittedData);
                });

                Swal.showLoading();

                timeInterval = setInterval( ()=>
                {
                    Swal.getContent().querySelector("strong").textContent = Math.ceil( Swal.getTimerLeft() / 1000 )
                },1000);
            },
            onOpen : () =>{
                /*caller-side: listener accept & server connects caller and listener */
                socket.on("response-listener-side-accept-video-call-to-caller", function(callInformation){
                    // Swal.fire({
                    //     icon: 'error',
                    //     title: `Oops...!`,
                    //     text: `${callInformation.listenerName} accepts call`,
                    //   });
                    Swal.close();
                    clearInterval(timeInterval);
                    console.log("caller-side: listener accept call");
                });

                /*caller-side: listener refuses video call */
                socket.on("response-listener-side-refuse-video-call",function(callInformation){
                    Swal.fire({
                        icon: 'error',
                        title: `Oops...!`,
                        text: `${callInformation.listenerName} is busy now`,
                      });

                    //Swal.close();
                    clearInterval(timeInterval);

                    
                });
            },
            onClose : () =>{
                clearInterval(timeInterval);
            }
        })
        .then( (result) =>
        { 
            return false;
        })
    });

    /* Step 3 */
    socket.on("response-caller-side-call-listener", function(callInformation){
        let emittedData = {

            callerID   : callInformation.callerID,
            callerName : callInformation.callerName,
            callAvatar : callInformation.callerAvatar,

            listenerID   : callInformation.listenerID,
            listenerName : callInformation.listenerName,
            listenerPeerID : callInformation.listenerPeerID
        }

        let timeInterval;
        Swal.fire(
        {
            title : ` <span span style="color: #0077ff">${callInformation.callerName}</span> is calling
            <i class="fa fa-volume-control-phone"></i>`,
            html : 
            `   Countdown : <strong style="color: #0077ff;"></strong> seconds </br></br>
                <p> Do you want to take this call ? </p>
                <button class="btn btn-primary" id="accept-video-call">Yes</button>
                <button class="btn btn-danger" id="refuse-video-call">No</button>
            `,
            backdrop : "rgba(85, 85, 85, 0.4)",
            timer : 30000,
            allowOutsideClick : false,
            onBeforeOpen : ()=>
            {
                /* Handle event accept video call */
                $("#accept-video-call").bind("click", function(){
                    Swal.close();
                    clearInterval(timeInterval);
 
                    /*Listener refuses video call */
                    socket.emit("listener-side-accept-video-call", emittedData);
                });

                /* Handle event refuse video call */
                $("#refuse-video-call").bind("click", function(){
                    Swal.close();
                    clearInterval(timeInterval);

                    /*Listener refuses video call */
                    socket.emit("listener-side-refuse-video-call", emittedData);
                });

                Swal.showLoading();
                timeInterval = setInterval( ()=>
                {
                    Swal.getContent().querySelector("strong").textContent = Math.ceil( Swal.getTimerLeft() / 1000 )
                },1000);
            },
            onOpen: ()=>{
                /* listener accept & server connects caller and listener */
                socket.on("response-listener-side-accept-video-call-to-listener",function(callInformation){
                    //Swal.close();
                    clearInterval(timeInterval);
                    console.log("listen-side: listener accept call");
                });

                /* caller cancels video call */
                socket.on("response-caller-side-cancel-call-listener", function(callInformation){
                    Swal.close();
                    clearInterval(timeInterval);
                });
            },
            onClose : () =>{
                clearInterval(timeInterval);
            }
        })
        .then( (result) =>
        { 
            return false;
        });

    });
});