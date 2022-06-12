import { body } from "express-validator";

export class AuthValidator {
    static SignUp = [
        body('email')
            .exists().withMessage('email must exists')
            .trim()
            .not().isEmpty().withMessage("email doesn't be empty")
            .isEmail().withMessage('input must be a valid email')
            .toUpperCase(),
        body('password')
            .exists().withMessage('password must exists')
            .trim()
            .not().isEmpty().withMessage("password doesn't be empty")
            .isLength({min: 8}).withMessage('password must be at least 8 characters')
    ];

    static Login = [
        body('email')
            .exists().withMessage('email must exists')
            .trim()
            .not().isEmpty().withMessage("email doesn't be empty")
            .isEmail().withMessage('input must be a valid email')
            .toUpperCase(),
        body('password')
            .exists().withMessage('password must exists')
            .trim()
            .not().isEmpty().withMessage("password doesn't be empty")
    ]

    static RecoverAccount = [
        body('email')
            .exists().withMessage('email must exists')
            .trim()
            .not().isEmpty().withMessage("email doesn't be empty")
            .isEmail().withMessage('input must be a valid email')
            .toUpperCase()
    ];

    static NewPassword = [
        body('password')
        .exists().withMessage('password must exists')
        .trim()
        .not().isEmpty().withMessage("password doesn't be empty")
        .isLength({min: 8}).withMessage('password must be at least 8 characters')
    ];
}