import dotenv from 'dotenv';
dotenv.config();

export class DBConfig {
    //Private DB Config
    static HOST = process.env.HOST;
    static PORT = process.env.DB_PORT;
    static USER = process.env.DB_USER;
    static PASSWORD = process.env.DB_PASSWORD;

    static NAME = process.env.DB_NAME;
}

(() => {
    console.log(DBConfig.HOST)
    console.log(DBConfig.PORT);
    console.log(DBConfig.USER);
    console.log(DBConfig.PASSWORD);
    console.log(DBConfig.NAME);
})();