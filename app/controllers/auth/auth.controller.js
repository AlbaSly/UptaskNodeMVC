import bcrypt from 'bcrypt';
import crypto from 'crypto';
import moment from 'moment';

import { UsersModel } from "../../models/Users.model.js";

import { SendEmail } from '../../handlers/mail.js';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export class AuthController {
    constructor() {}
    
    SignUp(user) {
        return new Promise(async (resolve, reject) => {
            try {
                const userFound = await UsersModel.findOne({where: {email: user.email}});

                if (userFound && userFound.active) {
                    reject({
                        error: true,
                        msg: 'Email already exists'
                    });

                    return;
                }

                //1800000 = 30 min

                if (userFound && !userFound.active && userFound.activationToken) {
                    Object.assign(userFound, user);
                
                    const expiration = moment(Date.now() + 600000).format(DATE_FORMAT);
                    userFound.tokenExp = expiration;

                    await userFound.save();

                    resolve({
                        error: false,
                        msg: `New Activation Token sent to ${user.email}, expires on ${expiration}`
                    });

                    return;
                }

                const expiration = moment(Date.now() + 1800000).format(DATE_FORMAT);
                user.tokenExp = expiration;

                const userCreated = await UsersModel.create(user);

                resolve({
                    error: false,
                    msg: `Activation Token sent to  ${user.email}, expires on ${expiration}`
                });
            } catch (error) {
                reject({
                    error: true,
                    msg: 'An error has occurred during sign up',
                    errorDetails: error
                });
            }   
        });
    }

    //Login Method 
    // Login(user) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const userFound = await UsersModel.findOne({
    //                 where: {
    //                     email: user.email
    //                 }
    //             });

    //             if (!userFound) {
    //                 reject({
    //                     error: true,
    //                     msg: 'User not found'
    //                 });
    //             }
                
    //             bcrypt.compare(user.password, userFound.password, (error, correct) => {
    //                 const isCorrectPassword = correct;
                
    //                 if (userFound && !isCorrectPassword) {
    //                     reject({
    //                         error: true, 
    //                         msg: 'Incorrect Password'
    //                     });
    
    //                     return;
    //                 }
    
    //                 if (userFound && isCorrectPassword && !userFound.active) {
    //                     reject({
    //                         error: true,
    //                         msg: 'User not actived'
    //                     });
    
    //                     return;
    //                 }
    
    //                 resolve({
    //                     error: false,
    //                     msg: 'Login Successful',
    //                     data: {
    //                         user: userFound
    //                     }
    //                 });
    //             });
    //         } catch (error) {
    //             reject({
    //                 error: true,
    //                 msg: 'An error has occurred durign login',
    //                 errorDetails: error
    //             });
    //         }

    //     });
    // }

    ActivateAccount(token) {
        return new Promise(async (resolve, reject) => {
            try {
                const userFound = await UsersModel.findOne({
                    where: {
                        activationToken: token
                    }
                });

                if (!userFound) {
                    reject({
                        error: true,
                        msg: 'Token not found'
                    });

                    return;
                }
                
                const tokenExpiration = moment(userFound.tokenExp).format(DATE_FORMAT);
                const currentTime = moment(Date.now()).format(DATE_FORMAT);

                const isExpired = currentTime > tokenExpiration;

                if (isExpired) {
                    reject({
                        error: true,
                        msg: `Token expired at ${tokenExpiration}`
                    });

                    return;
                }

                userFound.tokenExp = null;
                userFound.activationToken = null;
                userFound.active = 1;

                await userFound.save();

                resolve({
                    error: false,
                    msg: 'Account activated successfuly'
                });
            } catch (error) {
                reject({
                    error: true,
                    msg: 'An error has ocurred during token authentication'
                });
            }
        });
    }

    RecoverAccount(email) {
        return new Promise(async (resolve, reject) => {
            try {
                const userFound = await UsersModel.findOne({
                    where: {
                        email
                    }
                });

                if (!userFound) {
                    reject({
                        error: false,
                        msg: 'User not found'
                    });

                    return;
                }

                const expiration = moment(Date.now()+600000).format(DATE_FORMAT);

                userFound.tokenExp = expiration;
                const recoverToken = crypto.randomBytes(20).toString('hex');
                userFound.recoverToken = recoverToken;

                await userFound.save();

                await SendEmail({
                    email: userFound.email,
                    subject: 'Reset Password',
                    type: 'reset-password',
                    url: `${process.env.FULL_HOST_PORT}/auth/reset-password/${recoverToken}`
                });

                resolve({
                    error: false,
                    msg: `Recuperation token sent to ${userFound.email}. Expires on ${expiration}`
                });
            } catch (error) {
                reject({
                    error: true,
                    msg: 'An error has ocurred during account recuperation',
                    errorDetails: error
                });
            }
        });
    }

    VerifyResetPasswordToken(token) {
        return new Promise(async (resolve, reject) => {
            try {
                const userFound = await UsersModel.findOne({
                    where: {
                        recoverToken: token
                    }
                });

                if (!userFound) {
                    reject({
                        error: true,
                        msg: 'Token not found'
                    });

                    return;
                }

                const tokenExpiration = moment(userFound.tokenExp).format(DATE_FORMAT);
                const currentTime = moment(Date.now()).format(DATE_FORMAT);

                const isExpired = currentTime > tokenExpiration;

                //Una vez consultado el token, eliminarlo
                userFound.recoverToken = null;
                userFound.tokenExp = null;
                await userFound.save();

                if (isExpired) {

                    reject({
                        error: true,
                        msg: `Token expired at ${tokenExpiration}`
                    });

                    return;
                }

                resolve({
                    error: false,
                    msg: 'Successful',
                    data: {
                        id_user: userFound.id_user
                    }
                });
            } catch (error) {
                reject({
                    error: true,
                    msg: 'An error ocurred during token verification',
                    errorDetails: error
                });
            }
        });
    }

    ResetPassword(id_user, newPassword) {
        return new Promise(async (resolve, reject) => {
            try {
                const userFound = await UsersModel.findOne({
                    where: {
                        id_user
                    }
                });

                if (!userFound) {
                    reject({
                        error: true,
                        msg: 'User not found'
                    });

                    return;
                }

                userFound.password = await bcrypt.hash(newPassword, bcrypt.genSaltSync(5));
                userFound.tokenExp = null;
                userFound.recoverToken = null;

                await userFound.save();

                resolve({
                    error: false,
                    msg: 'Password change successful'
                });
            } catch (error) {
                reject({
                    error: true,
                    msg: 'An error ocurred during password reset',
                    errorDetails: error
                });
            }
        });
    }
}