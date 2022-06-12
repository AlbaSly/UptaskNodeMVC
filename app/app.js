import express from 'express';

import flash from 'connect-flash';
import session from 'express-session';
import cookies from 'cookie-parser';

import {passportConfig} from './config/passport.js';
import * as mail from './handlers/mail.js';

import {DB} from './config/connection.js';
import { RouteDeclarations } from './routes/Routes.js';

export const app = express();

(async () => {
    try {
        await import('./models/Projects.model.js');
        await import('./models/Tasks.model.js');  

        const response = await DB.sync();
        console.warn('DB Loaded');
    } catch (error) {
        console.error(error);
    }

    app.set('view engine', 'pug');
    app.set('views', './app/views/pages');
    app.use(express.static('./app/public'));
    
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

    app.use(cookies());
    app.use(session({
        secret: 'supersecret',
        resave: false,
        saveUninitialized: false
    }));
    app.use(flash());

    app.use(passportConfig.initialize());
    app.use(passportConfig.session());

    RouteDeclarations.routes.forEach(route => app.use(RouteDeclarations.path, route));
    app.use('*', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
        res.header("Access-Control-Allow-Headers", "X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
        res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    
        next();
    });
    app.use('*', (req, res) => {
        res.status(404).json({
            msg: 'Not Found',
            url: req.originalUrl
        });
    });
    
    const PORT = process.env.PORT || 3200;
    const HOST = process.env.HOST || '0.0.0.0';
    app.listen(PORT, HOST, () => {
        console.log(`SERVER STARTED --> ${HOST}:${PORT}`);
    });
})();