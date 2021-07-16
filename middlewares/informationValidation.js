/* the middleware check input data like :email , username , phone , address */
import {check} from "express-validator/check";
import {notice, userError} from "../notification/english.js";

let informationValidation = [
    check("username", userError.standardUsername)
        .optional()
        .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)
        .isLength({ min : 3 , max : 17 }),

    check("gender", userError.incorrectGender)
        .optional()
        .isIn( [ "male","female" ]),

    check("address", userError.standardAddress)
        .optional()
        .isLength({ min : 3 , max : 50}),

    check("phone", userError.standardPhone)
        .optional()
        .matches(/^(0)[0-9]{9,10}$/)
        .isLength({ min : 10 , max : 11})
]
    

module.exports = informationValidation