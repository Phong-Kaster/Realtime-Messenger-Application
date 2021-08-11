/*******************************************************
 * @param {*} href | base64 | message.file.data
 * views/home/section/contentRight - line 36, 42, 
 * @returns string form of @href
 *******************************************************/
export let bufferBase64ToString = (href)=>{
    return Buffer.from(href).toString("base64");
};