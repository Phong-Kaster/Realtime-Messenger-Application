import {check} from "express-validator/check";
import {userError} from "../notification/english.js";

let groupChatValidation = [
    check("friendIDs" , userError.notEnoughPeople)
            .custom((value)=>{
                if( !Array.isArray(value))
                {
                    return false;
                }
                if( value.length < 2)
                {
                    return false;
                }
                return true;
            }),
    
    check("groupChatName", userError.invalidGroupChatName)
            .isLength( { min:1 })
            .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)
]

module.exports = groupChatValidation;