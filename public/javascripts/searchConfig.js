/* check input is username which is being searching valid or not ?  */
function search(element){

    let keyword = $("#keyword").val();
    let regexUsername = /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/;
    

    // 13 is Key-code of Enter
    if(element.which === 13 || element.type === "click")
    {
        if( keyword.length < 0)
        {
            alertify.alert().set('message', 'Your gender must write a username or e-mail').show();
            return false;
        }

        if( !regexUsername.test(keyword) )
        {
            alertify.alert().set('message','Your keyword  is not valid.Only letter & number').show();
            return false;
        }

        $.get(`/search/${keyword}`,function(data){
            $("#find-user ul").html(data);
        })
    }
}

/* handle event search user to listen username is being searching */
function handleEventSearchUser(){
    $("#keyword").bind("keypress" , search );
}

/* handle Button search user to handle event click button search */
function handleButtonSearchUser(){
    $("#btn-search-keyword").bind("click" ,search );
}

$(document).ready(function(){

    handleEventSearchUser();
   
    handleButtonSearchUser();
});