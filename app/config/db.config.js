import dotenv from 'dotenv';
dotenv.config();

export class DBConfig {
    //Private DB Config
    static HOST = process.env.DB_HOST;
    static PORT = process.env.DB_PORT;
    static USER = process.env.DB_USER;
    static PASSWORD = process.env.DB_PASSWORD;

    static NAME = process.env.DB_NAME;

    //Public DB Config
    static POOL = {
        min: 0,
        max: 5,
        acquire: 30000,
        idle: 10000
    }
}