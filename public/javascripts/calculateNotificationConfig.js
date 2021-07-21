/************************************************************
 * increaseResultNumber & decreaseResultNumber are 2 functions that interact with DOM Object
 * @param {*} className that <div> name that is changed value of number
 * @value is the value that <div> tag will be changed
 * @returns the latest value bases on action in contact management
 ************************************************************/
function increaseResultNumber(className){

    let value =  +$(`.${className}`).find("strong").text();
    value = value+1;
    
    if(value === 0)
    {
        +$(`.${className}`).html("");
    }
    +$(`.${className}`).html(`(<strong>${value}</strong>)`);
}
function decreaseResultNumber(className){
    let value = $(`.${className}`).find("strong").text();
    value--;

    if( value === 0)
    {
        $(`.${className}`).html("");
    }
    
    $(`.${className}`).html( (`(<strong>${value}</strong>)`) ) ;
}



/************************************************************
 * increaseNotificationNumber & decreaseNotificationNumber are 2 functions that interact with DOM Object
 * @param {*} className that <div> name that is changed value of number
 * @value is the value that <div> tag will be changed
 * @returns number of notifications
 ************************************************************/
function increaseNotificationNumber(className){
    // "+" converted value from string to number
    let value =  +$(`.${className}`).text();
    value = value+1;
    
    if(value === 0)
    {
        +$(`.${className}`).css( "display" , "none" ).html("");
    }
    +$(`.${className}`).css( "display" , "block" ).html(value);
}
function decreaseNotificationNumber(className){
    let value = $(`.${className}`).text();
    value--;

    if(value === 0)
    {
        +$(`.${className}`).css( "display" , "none" ).html("");
    }
    +$(`.${className}`).css( "display" , "block" ).html(value);
}