/************************************
 * @param {*} array |  is array that we wanna get the last element
 * @returns the last element of @array
 ************************************/
export let retrieveTheLastOfArray = (array)=>{
    if( !array.length )
    {
        return [];
    }
    return array[array.length - 1];
};