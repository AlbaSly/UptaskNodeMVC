import { validationResult } from "express-validator";

import { TasksController } from "../../controllers/tasks/tasks.controller.js";

export const AddTask = async (req, res, next) => {
    const project = res.locals.project;

    const {errors} = validationResult(req);

    if (errors.length) {
        const dataError = encodeURIComponent(errors[0].msg);
        res.redirect(`/projects/view/${req.params.slug}?error=${dataError}`); 
        return;
    }

    const task = {
        ...req.body,
        finished: 0,
        projectIdProject: project.id_project
    }

    try {
        const response = await new TasksController().AddTask(task);
        next();
    } catch (error) {
        res.status(400).json(error);
    }
}

export const GetTasks = async (req, res) => {
    try {
        const response = await new TasksController().GetTasks(project);

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json(error);
    }
}

export const VerifyProjectTask = async (req, res, next) => {
    const user = res.locals.user;

    const taskInfo = {
        ...req.body,
        taskId: req.params.id,
        userIdUser: user.id_user
    }
    
    try {
        const {data: taskFound} = await new TasksController().VerifyProjectTask(taskInfo);
        res.locals.task = {
            ...taskFound
        }
        next();
    } catch (error) {
        res.status(400).json(error);
    }
}

export const ChangeTaskStatus = async (req, res) => {
    const task = res.locals.task.taskFound;

    try {
        const response = await new TasksController().ChangeTaskStatus(task);

        res.status(200).json(response); 
    } catch (error) {
        res.status(400).json(error);
    }
}

export const DeleteTask = async (req, res) => {
    const task = res.locals.task.taskFound;

    try {
        const response = await new TasksController().DeleteTask(task);

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json(error);
    }
}