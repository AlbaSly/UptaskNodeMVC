import { Router } from "express";

import { VerifyAuth } from "../../middlewares/home/auth.mw.js";
import { 
    CheckProjectExistence, 
    ShowProjectView 
    } from "../../middlewares/projects/projects.mw.js";
import { 
    AddTask, 
    ChangeTaskStatus, 
    DeleteTask, 
    GetTasks, 
    VerifyProjectTask 
    } from "../../middlewares/tasks/tasks.mw.js";

import {TasksValidator} from '../../validations/tasks/tasks.validator.js';

export const TasksRouter = Router({mergeParams: true});

const TaskRouterChilds = Router();

TasksRouter.use('/tasks', TaskRouterChilds);

//Methods
TaskRouterChilds.post('/new/:slug', VerifyAuth, CheckProjectExistence, TasksValidator.NewTask, AddTask, ShowProjectView);
TaskRouterChilds.get('/list/:slug', VerifyAuth, CheckProjectExistence, GetTasks)
TaskRouterChilds.patch('/change-status/:id', VerifyAuth, VerifyProjectTask, ChangeTaskStatus);
TaskRouterChilds.post('/delete/:id', VerifyAuth, VerifyProjectTask, DeleteTask);