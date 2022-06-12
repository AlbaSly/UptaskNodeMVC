import { Router } from "express";

//Middlewares
import { 
    ShowProjectView, 
    ShowNewProjectView, 
    NewProject, 
    CheckProjectExistence,
    ShowEditProjectView,
    EditProject,
    DeleteProject
    } from "../../middlewares/projects/projects.mw.js";

import { ShowHomeView } from "../../middlewares/home/home.mw.js";
import { VerifyAuth } from "../../middlewares/home/auth.mw.js";
//Validation Chains
import { ProjectsValidator } from "../../validations/projects/projects.validator.js";

//Router
export const ProjectsRouter = Router({mergeParams: true});
//Router Childs
const ProjectsRouterChilds = Router();

ProjectsRouter.use('/projects', ProjectsRouterChilds);

//Views
ProjectsRouterChilds.get('/new', VerifyAuth, ShowNewProjectView); //View
ProjectsRouterChilds.get('/view/:slug', VerifyAuth, CheckProjectExistence, ShowProjectView); //View
ProjectsRouterChilds.get('/edit/:slug', VerifyAuth, CheckProjectExistence, ShowEditProjectView); //View

//Methods
ProjectsRouterChilds.post('/new', VerifyAuth, ProjectsValidator.NewProject, NewProject, ShowHomeView);
ProjectsRouterChilds.post('/edit/:slug', VerifyAuth, CheckProjectExistence, ProjectsValidator.NewProject, EditProject);
ProjectsRouterChilds.delete('/delete/:slug', VerifyAuth, CheckProjectExistence, DeleteProject);