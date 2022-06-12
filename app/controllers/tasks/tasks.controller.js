import { TasksModel } from "../../models/Tasks.model.js";
import { ProjectsModel } from "../../models/Projects.model.js";

export class TasksController {
    constructor() {}

    AddTask(task) {
        return new Promise(async (resolve, reject) => {
            try {
                await TasksModel.create(task);

                resolve({
                    error: false,
                    msg: 'Task Added'
                });
            } catch (error) {
                reject({
                    error: true,
                    msg: 'Error during task creation',
                    errorDetails: error
                });
            }
        });
    }

    VerifyProjectTask(taskInfo) {
        return new Promise(async (resolve, reject) => {
            try {
                const taskFound = await TasksModel.findOne({
                    where: {
                        id_task: taskInfo.taskId
                    },
                    include: [
                        {
                            model: ProjectsModel
                        }
                    ]
                });

                if (!taskFound) {
                    reject({
                        error: true,
                        msg: 'Task not found'
                    });
                    return;
                }

                const projectFound = await ProjectsModel.findOne({
                    where: {
                        url: taskInfo.projectUrl,
                        userIdUser: taskInfo.userIdUser
                    }
                });

                if (!projectFound) {
                    reject({
                        error: true,
                        msg: 'Project not Found'
                    });
                    return;
                }
                
                if (taskFound.project.url !== taskInfo.projectUrl) {
                    reject({
                        error: true,
                        msg: `Task not found`
                    });
                    return;
                }

                resolve({
                    error: false,
                    msg: 'Task Found!',
                    data: {
                        taskFound
                    }
                });
            } catch (error) {
                reject({    
                    error: true,
                    msg: 'Error during task search',
                    errorDetails: error
                });
            }
        });
    }

    ChangeTaskStatus(task) {
        return new Promise(async (resolve, reject) => {
            try {
                const taskFound = await TasksModel.findOne({
                    where: {
                        id_task: task.id_task
                    }
                });

                taskFound.finished = taskFound.finished ? 0 : 1;

                await taskFound.save();

                resolve({
                    error: false,
                    msg: 'Task status changed!'
                });
            } catch (error) {
                reject({
                    error: true,
                    msg: 'Error during task status change',
                    errorDetails: error
                });
            }
        });
    }

    DeleteTask(task) {
        return new Promise(async (resolve, reject) => {
            try {
                const taskFound = await TasksModel.destroy({
                    where: {
                        id_task: task.id_task
                    }
                });
                console.log(taskFound);
                resolve({
                    error: false,
                    msg: 'Task deleted!'
                });
            } catch (error) {
                reject({
                    error: true,
                    msg: 'Error during task deletion',
                    errorDetails: error
                });
            }
        });
    }

    GetTasks(project) {
        return new Promise(async (resolve, reject) => {
            try {
                const tasks = await TasksModel.findAll({
                    where: {
                        projectIdProject: project.id_project
                    },
                    include: [
                        {
                            model: ProjectsModel
                        }
                    ]
                });

                resolve(tasks);
            } catch (error) {
                reject({
                    error: true,
                    msg: 'Error when obtaining list',
                    errorDetails: error
                });
            }
        });
    }
}