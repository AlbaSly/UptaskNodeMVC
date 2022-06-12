import sequelize from "sequelize";

import { DB } from "../config/connection.js";
import { ProjectsModel } from "./Projects.model.js";

export const TasksModel = DB.define('tasks', {
    id_task: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: sequelize.STRING(50),
    finished: sequelize.INTEGER
})

ProjectsModel.hasMany(TasksModel);
TasksModel.belongsTo(ProjectsModel);