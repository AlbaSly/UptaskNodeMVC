import { body } from "express-validator";

export class ProjectsValidator {
    static NewProject = [
        body('name')
            .exists().withMessage('name must exists')
            .trim()
            .not().isEmpty().withMessage("name doesn't be empty")
            .toUpperCase()
            .escape()
    ]
}