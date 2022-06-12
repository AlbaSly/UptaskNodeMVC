import sequelize, { Sequelize } from 'sequelize';

import {DBConfig} from './db.config.js';

export const DB = new Sequelize(DBConfig.NAME, DBConfig.USER, DBConfig.PASSWORD, {
    host: DBConfig.HOST,
    dialect: 'mysql',
    operatorsAliases: false,
    define: {timestamps: false},
    pool: DBConfig.POOL
});