socket.on("server-send-active-users", function(activeUsers){
    activeUsers.forEach( (element)=>{
        $(`.person[data-chat = ${element}]`).find("div.dot").addClass("online");
        //$(`.person[data-chat = ${element}]`).find("img").addClass("avatar-online");
    });
});

socket.on("server-send-a-new-active-user", function(activeUser){
    $(`.person[data-chat = ${activeUser}]`).find("div.dot").addClass("online");
    //$(`.person[data-chat = ${activeUser}]`).find("img").addClass("avatar-online");
});

socket.on("server-send-a-new-inactive-user", function(activeUser){
    $(`.person[data-chat = ${activeUser}]`).find("div.dot").removeClass("online");
    //$(`.person[data-chat = ${activeUser}]`).find("img").removeClass("avatar-online");
});