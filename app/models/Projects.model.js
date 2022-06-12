import sequelize from "sequelize";

import slug from "slug";
import shortid from "shortid";

import { DB } from "../config/connection.js";

import { UsersModel } from "./Users.model.js";

export const ProjectsModel = DB.define('projects', {
    id_project: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize.STRING(60)
    },
    url: {
        type: sequelize.STRING
    }
}, {
    hooks: {
        beforeCreate(project) {
            const url = slug(project.name).toLowerCase();

            project.url = `${url}-${shortid.generate()}`;
        }
    }
});

UsersModel.hasMany(ProjectsModel);
ProjectsModel.belongsTo(UsersModel);