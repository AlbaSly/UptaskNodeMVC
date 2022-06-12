import { ProjectsModel } from "../../models/Projects.model.js";
import { TasksModel } from "../../models/Tasks.model.js";

export class ProjectsController {
    constructor() {}

    NewProject(project) {
        return new Promise(async (resolve, reject) => {
            try {
                await ProjectsModel.create(project);

                resolve({
                    error: false,
                    msg: 'Project Created'
                });
            } catch (error) {
                reject({
                    error: true,
                    msg: 'Error during project creation'
                });
            }
        });
    }

    GetProject(projectUrl, user) {
        return new Promise(async (resolve, reject) => {
            try {
                const projectFound = await ProjectsModel.findOne({
                    where: {
                        url: projectUrl,
                        userIdUser: user.id_user
                    }
                });

                if (!projectFound) {
                    reject({
                        error: true,
                        msg: 'Project not found'
                    });
                    return;
                }
                
                resolve(projectFound);
            } catch (error) {
                reject({
                    error: true,
                    msg: 'Error when obtaining project',
                    errorDetails: error
                })
            }
        });
    }

    GetProjects(user) {
        return new Promise(async (resolve, reject) => {
            try {
                const projectsList = await ProjectsModel.findAll({
                    where: {
                        userIdUser: user.id_user
                    }
                });

                resolve(projectsList);
            } catch (error) {
                reject({
                    error: true,
                    msg: 'Error when obtaining list',
                    errorDetails: error
                })
            }
        });
    }

    EditProject(project) {
        return new Promise(async (resolve, reject) => {
            try {
                const projectFound = await ProjectsModel.findOne({
                    where: {
                        url: project.url,
                        userIdUser: project.userIdUser
                    }
                });

                if (!projectFound) {
                    reject({
                        error: true,
                        msg: 'Project not found'
                    });
                    return;
                }

                Object.assign(projectFound, project);

                await projectFound.save();
                resolve({
                    error: false,
                    msg: 'Project Updated',
                    data: {
                        projectUpdated: projectFound
                    }
                })
            } catch (error) {
                reject({
                    error: false,
                    msg: 'Error when updating Project',
                    errorDetails: error
                });
            }
        });
    }
    
    DeleteProject(project) {
        return new Promise(async (resolve, reject) => {
            try {
                const projectFound = await ProjectsModel.findOne({
                    where: {
                        url: project.url,
                        userIdUser: project.userIdUser
                    }
                });
                
                if (!projectFound) {
                    reject({
                        error: true,
                        msg: 'Project not Found'
                    });
                    
                    return;
                }
                
                await TasksModel.destroy({where: {projectIdProject: projectFound.id_project}});
                await ProjectsModel.destroy({where: {url: project.url}});

                resolve({
                    error: false,
                    msg: 'Project Deleted',
                    data: {
                        projectDeleted: projectFound.url
                    }
                });
            } catch (error) {
                reject({
                    error: true,
                    msg: 'Error when deleting Project',
                    errorDetails: error
                });
            }
        })
    }
}