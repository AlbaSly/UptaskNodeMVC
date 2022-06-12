import sequelize, { Sequelize } from 'sequelize';

import {DBConfig} from './db.config.js';

export const DB = new Sequelize(DBConfig.NAME, DBConfig.USER, DBConfig.PASSWORD, {
    host: DBConfig.HOST,
    dialect: 'mysql',
    operatorsAliases: false,
    define: {timestamps: false},
    pool: {
        min: 0,
        max: 5,
        acquire: 30000,
        idle: 10000
    }
});