/*******************************************************
 * @param {*} href | base64 | message.file.data
 * views/home/section/contentRight - line 36, 42, 
 * @returns string form of @href
 *******************************************************/
const moment = require('moment');

export let convertTimestamp = (timestamp)=>{
    if( !timestamp )
    {
        return "";
    }

    return moment(timestamp).locale("en").startOf("seconds").fromNow();
}