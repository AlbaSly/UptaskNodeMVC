import { validationResult } from "express-validator";

//Controller
import { ProjectsController } from "../../controllers/projects/projects.controller.js";
import { TasksController } from '../../controllers/tasks/tasks.controller.js';

//VIEW
export const ShowProjectView = async (req, res) => {
    const user = res.locals.user;

    const {error} = req.query;
    
    const project = res.locals.project;

    let projectsList = [];
    let tasksList = [];

    try {
        [projectsList, tasksList] = await Promise.all(
            [
                new ProjectsController().GetProjects(user), 
                new TasksController().GetTasks(project)
            ]);

    } catch (error) {}
    res.render('project', {
        pageTitle: project.name,
        project,
        projectsList,
        tasksList,
        ...(error && {error})
    });
};

//VIEW
export const ShowNewProjectView = async (req, res) => {
    const user = res.locals.user;
    const {error} = req.query;

    let projectsList = [];
    try {
        projectsList = await new ProjectsController().GetProjects(user);
    } catch (error) {}

    res.render('new-project', {
        pageTitle: 'UpTask | New',
        projectsList,
        ...(error && {error})
    }); 
};

//VIEW
export const ShowEditProjectView = async (req, res) => {
    const user = res.locals.user;
    const {error} = req.query;

    const project = res.locals.project;

    let projectsList = [];
    try {
        projectsList = await new ProjectsController().GetProjects(user);
    } catch (error) {}

    res.render('edit-project', {
        pageTitle: `Editing Project Name`,
        project,
        projectsList,
        ...(error && {error})
    });
}

export const NewProject = async (req, res, next) => {
    const {errors} = validationResult(req);
    
    if (errors.length) {
        const dataError = encodeURIComponent(errors[0].msg);
        res.redirect(req.originalUrl+'?error='+dataError);
        return;
    }

    const user = res.locals.user;
    
    const project = {
        ...req.body,
        userIdUser: user.id_user
    }

    try {
        const response = await new ProjectsController().NewProject(project);
        next();
    } catch (error) {
        const dataError = encodeURIComponent(error.msg);
        res.redirect(req.originalUrl+'?error='+dataError);
    }
};

export const CheckProjectExistence = async (req, res, next) => {
    const projectUrl = req.params.slug;
    const user = res.locals.user;

    try {
        const response = await new ProjectsController().GetProject(projectUrl, user);
        
        res.locals.project = response;
        
        next();
    } catch (error) {
        res.redirect('/');
    }
}

export const EditProject = async (req, res) => {
    const user = res.locals.user;
    const {errors} = validationResult(req);
    
    if (errors.length) {
        const dataError = encodeURIComponent(errors[0].msg);
        res.redirect(req.originalUrl+'?error='+dataError);
        return;
    }

    const project= {
        url: req.params.slug,
        ...req.body,
        userIdUser: user.id_user
    }

    try {
        const response = await new ProjectsController().EditProject(project);
        res.redirect(req.originalUrl);
    } catch (error) {
        res.redirect('/');
    }
}

export const DeleteProject = async (req, res) => {
    const user = res.locals.user;
    const projectUrl = req.params.slug;

    const project = {
        url: req.params.slug,
        userIdUser: user.id_user
    }

    try {
        const response = await new ProjectsController().DeleteProject(project);
        
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}