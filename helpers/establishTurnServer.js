/* For most WebRTC applications to function a server is required for relaying the traffic between peers, 
since a direct socket is often not possible between the clients(unless they reside on the same 
local network). 

The common way to solve this is by using a TURN server. 
The term stands for Traversal Using Relay NAT, and it is a protocol for relaying network traffic. 

URL: https://global.xirsys.net/dashboard/services

API Credentials:
+ ident: n18dccn147
+ secret: 71820f88-002c-11ec-9995-0242ac130003
+ channel: RealtimeMessengerApplication
*/
const request = require('request');

export let establishTurnServer = ()=>{
    return new Promise( async (resolve, reject)=>{
        // Node Get ICE STUN and TURN list
        let o = {
            format: "urls"
        };

        let bodyString = JSON.stringify(o);

        let options = {
            url : "https://global.xirsys.net/_turn/RealtimeMessengerApplication",
            // host: "global.xirsys.net",
            // path: "/_turn/RealtimeMessengerApplication",
            method: "PUT",
            headers: {
                "Authorization": "Basic " + Buffer.from("n18dccn147:71820f88-002c-11ec-9995-0242ac130003").toString("base64"),
                "Content-Type": "application/json",
                "Content-Length": bodyString.length
            }
        };

        request(options, function (error, response, body) {
            if( error )
            {
                reject(error);
            }
            //console.log(body);
            let bodyJSON = JSON.parse(body);
            resolve(bodyJSON.v.iceServers);
        });
    });
}