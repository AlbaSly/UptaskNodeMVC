import { ProjectsController } from '../../controllers/projects/projects.controller.js';

export const ShowHomeView = async (req, res) => {
    const user = res.locals.user;
    
    let projectsList = [];

    try {
        projectsList = await new ProjectsController().GetProjects(user);
    } catch (error) {}

    res.render('home', {
        pageTitle: 'UpTask | Home',
        projectsList
    });
};