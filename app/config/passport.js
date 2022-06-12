import passport from 'passport';
import {Strategy} from 'passport-local';

import bcrypt from 'bcrypt';

import { UsersModel } from '../models/Users.model.js';

export const passportConfig = passport.use(
    new Strategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const userFound = await UsersModel.findOne({
                where: {
                    email
                }
            });

            if (!userFound) {
                return done(null, false, {
                    message: 'User not found'
                });
            }

            bcrypt.compare(password, userFound.password, (error, correct) => {
                const isCorrectPassword = correct;
            
                if (userFound && !isCorrectPassword) {
                    return done(null, false, {
                        message: 'Incorrect Password'
                    });
                }

                if (userFound && isCorrectPassword && !userFound.active) {
                    return done(null, false, {
                        message: 'User not activated'
                    });
                }

                return done(null, userFound, {
                    message: 'Login successful'
                });
            });
        } catch (error) {
            return done(null, false, {
                message: 'Error'
            });
        }
    })
);

//serialize
passportConfig.serializeUser((user, callback) => {
    callback(null, user)
});

//deserialize
passportConfig.deserializeUser((user, callback) => {
    callback(null, user)
});