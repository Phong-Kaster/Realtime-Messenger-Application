/*********************************************************************
 * @param {*} dataChat | [data-chat="ha378"] | is a property in HTML used to 
 * indicate what conversation user is chatting
 * 
 * listen event click on "video call" button
 * 
 * emit event caller side check listener
 * 
 * response emit event include 2 case
 * 1. Listener is online & this event continues
 * 2. Listener is offline & this event stops
 *********************************************************************/
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



/*********************************************************************
 * @param {*} videoID | string
 * @param {*} stream | object
 * 
 * "onloadeddata" event occurs when data for the current frame is loaded, 
 * but not enough data to play next frame of the specified audio/video.
 * 
 * "srcObject" property of the HTMLMediaElement interface sets or returns the object which serves 
 * as the source of the media associated with the HTMLMediaElement. 
 * The object can be a MediaStream, a MediaSource, a Blob, or a File (which inherits from Blob).
 *********************************************************************/
function playVideoStream( videoID , stream )
{
    let video = document.getElementById(videoID);
    video.srcObject = stream;
    video.onloadeddata = function(){
        video.play();
    }
}



/*********************************************************************
 * @param {*} stream | is the connection between caller & listener
 *********************************************************************/
function closeVideoStream( stream )
{
    return stream.getTracks().forEach( element => element.stop() );
}




/*********************************************************************
 * @timeInterval
 * 
 * @IceServer | object | is used to make a video call 
 * listen events will happen if a user makes a call to another user
 * 
 * @PeerID | string | is the needed ID that PeerJS uses to specify who caller wanna call.
 * Equipped with nothing but an ID, a peer can create a P2P data or media stream connection to a remote peer.
 * 
 * @emittedData | object | is a bundle of data which a socketIO event send to the server
 * @callInformation | object | is a bundle of data which the server returns to a socketIO event have just sent
 * 
 * **************************************************************************
 * *************************** VIDEO CALL EVENT *****************************
 * **************************************************************************
 * INPUT: function "handle Event Call Video" catches event click "video call" button.It returns 2 case 
 *          Case 1 : listener is offline
 *          Case 2 : listener is online
 * Case 1 : listener is offline. Then "response-caller-side-listener-offline" is returned & stop the call
 * 
 * Case 2 : listener is online.
 *      Step 1:     Send a Peer ID of listener to server that listener is ready to receive video call
 *                  Event          "listener-side-pass-peer-id-to-server" is activated with @emittedData
 * 
 * 
 *      Step 2:     Event "response-listener-side-pass-peer-id-to-server" response with @callInformation
 * 
 *      Step 2.1:   Caller-side, user can send event "caller-side-call-listener" to start a video call
 *                  A dashboard pops up, caller is able to cancel video call with 
 *                                      event "caller-side-cancel-call-listener" with caller-side
 * 
 *      Step 2.2:   Event "response-caller-side-call-listener" response with @callInformation
 *                  Listener-side, receiver can @acceptVideoCall or @refuseVideoCall
 *                  If @acceptVideoCall , event "listener-side-accept-video-call" is activated
 *                  If @refuseVideoCall , event "listener-side-refuse-video-call" is activated
 *                                                  Or
 *                  If caller change his/her mind, event "response-caller-side-cancel-call-listener" is activated to end the video
 *                  call with listener-side
 * 
 *      Step 3:     Only if listener-side chooses @acceptVideoCall, these actions which is below, happens
 *                  Event "listener-side-accept-video-call" returns 2 events:
 *                      1.response-listener-side-accept-video-call-to-caller: connect caller-side to PeerJS stream
 *                      2.response-listener-side-accept-video-call-to-listener: connect listener-side to PeerJS stream
 *********************************************************************/
$(document).ready(function(){

    let timeInterval;
    let iceTurnServer = $("#ICE-servers").val();
    iceTurnServer = JSON.parse(iceTurnServer);
      

    let PeerID;
    let peer = new Peer({
        key: "peerjs",
        host: "peerjs-server-trungquandev.herokuapp.com",
        secure: true,
        port: 443,
        //config:{ "iceServers":iceTurnServer }
    });
    peer.on("open" , function(ID){
        PeerID = ID;
    });



    /**************************************************************************/
    /**************************** VIDEO CALL EVENT ****************************/
    /**************************************************************************/
    /* CASE 1 */
    socket.on("response-caller-side-listener-offline", function(){
        alertify.notify("This user is offline" , "error" , 7 );
    });

    /* CASE 2 */
    /* Step 1 */
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
        /* Step 2.1 */
        socket.emit("caller-side-call-listener" , emittedData );


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


    /* Step 2.2 */
    socket.on("response-caller-side-call-listener", function(callInformation){
        let emittedData = {

            callerID   : callInformation.callerID,
            callerName : callInformation.callerName,
            callAvatar : callInformation.callerAvatar,

            listenerID   : callInformation.listenerID,
            listenerName : callInformation.listenerName,
            listenerPeerID : callInformation.listenerPeerID
        }

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

    /* Step 3 */
    /*caller-side: listener accept & server connects caller and listener */
    socket.on("response-listener-side-accept-video-call-to-caller", function(callInformation){
        console.log("server-to-caller");
        console.log(callInformation);


        Swal.close();
        clearInterval(timeInterval);

        
        let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
        getUserMedia({video: true, audio: true}, function(stream) 
        {
            /* caller webcam */
            $("#streamModal").modal("show");
            playVideoStream("local-stream", stream);
            
            let call = peer.call( callInformation.listenerPeerID , stream);
            call.on('stream', function(remoteStream) {
                /* listener webcam */
                playVideoStream("remote-stream", remoteStream);
            });
            
            $("#streamModal").on("hidden.bs.modal", function(){
                Swal.fire({
                    icon: 'error',
                    title: `Oops...!`,
                    text: `You call with ${callInformation.listenerName} end !`,
                  });
                closeVideoStream(stream);
            });
        },
        function(err) 
        {
            console.log('Failed to get local stream' ,err);
            if( err.toString() === "NotAllowedError: Permission denied" && err.toString() === "NotFoundError: Requested device not found")
            {
                alertify.notify("Please, grant permission to access to camera & microphone !", "error",7);
            }
        });
    });

    /* listener accept & server connects caller and listener */
    socket.on("response-listener-side-accept-video-call-to-listener",function(callInformation){
        console.log("server-to-listener");
        console.log(callInformation);


        Swal.close();
        clearInterval(timeInterval);
        
        let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
        peer.on('call', function(call) {
        getUserMedia({video: true, audio: true}, function(stream) {

            $("#streamModal").modal("show");
            playVideoStream("local-stream", stream);
            
            call.answer(stream); // Answer the call with an A/V stream.
            call.on('stream', function(remoteStream) {
                playVideoStream("remote-stream", remoteStream);
            });

            $("#streamModal").on("hidden.bs.modal", function(){
                Swal.fire({
                    icon: 'error',
                    title: `Oops...!`,
                    text: `You call with ${callInformation.callerName} end !`,
                  });               
                closeVideoStream(stream);
            });
        }, 
        function(err) 
        {
            console.log('Failed to get local stream' ,err);
            if( err.toString() === "NotAllowedError: Permission denied" || err.toString() === "NotFoundError: Requested device not found")
            {
                alertify.notify("Please, grant permission to access to camera & microphone !", "error",7);
            }
        });
    });
    });
});