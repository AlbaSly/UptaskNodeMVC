import { body } from "express-validator";

export class TasksValidator {
    static NewTask = [
        body('name')
            .exists().withMessage('name must exists')
            .trim()
            .not().isEmpty().withMessage("name doesn't be empty")
            .escape()
    ];
}