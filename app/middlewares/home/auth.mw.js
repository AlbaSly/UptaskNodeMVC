import { validationResult } from "express-validator";

import { passportConfig } from "../../config/passport.js";

import { AuthController } from "../../controllers/auth/auth.controller.js";

export const ShowLoginView = (req, res) => {
    let error = req.flash('error');
    let info = req.flash('info');

    const {email} = req.query;

    res.render('public/login', {
        pageTitle: 'UpTask | Login',
        ...(error && {error}),
        ...(info && {info}),
        email
    });   
}

export const ShowSignUpView = (req, res) => {
    let error = req.flash('error');
    let info = req.flash('info');

    const {email} = req.query;

    res.render('public/signup', {
        pageTitle: 'UpTask | Sign Up',
        ...(error && {error}),
        ...(info && {info}),
        email
    });
}

export const ShowActivationResultView = (req, res) => {
    let info = req.flash('info');
    let error = req.flash('error');

    let resultTitle = req.flash('title');

    res.render('public/activation');

    res.render('public/activation', {
        pageTitle: `UpTask | ${resultTitle}`,
        ...(error && {error}),
        ...(info && {info}),
        resultTitle
    });
}

export const ShowRecoverAccountView = (req, res) => {
    let info = req.flash('info');
    let error = req.flash('error');

    const {email} = req.query;

    res.render('public/recover-account',{
        pageTitle: 'UpTask | Recover Account',
        ...(error && {error}),
        ...(info && {info}),
        email
    });
}

export const ShowNewPasswordView = (req, res) => {
    let info = req.flash('info');
    let error = req.flash('error');

    res.render('public/new-password', {
        pageTitle: 'UpTask | New Password',
        ...(error && {error}),
        ...(info && {info}),
    });
}


//HTTP METHODS

export const SignUp = async (req, res) => {
    const {errors} = validationResult(req);

    if (errors.length) {
        const dataError = errors[0].msg;

        req.flash('error', dataError);

        const emailInput = encodeURIComponent(req.body.email);

        res.redirect(req.originalUrl + '?email=' + emailInput);

        return;
    }

    const user = req.body;

    try {
        const response = await new AuthController().SignUp(user);

        req.flash('info', response.msg);

        res.redirect(req.originalUrl);
    } catch (error) {
        req.flash('error', error.msg);
        console.log(error);
        const emailInput = encodeURIComponent(req.body.email);

        res.redirect(req.originalUrl + '?email=' + emailInput);
    }
}

export const LoginValidation = async (req, res, next) => {
    const {errors} = validationResult(req);

    if (errors.length) {
        const dataError = errors[0].msg;

        req.flash('error', dataError);

        const emailInput = encodeURIComponent(req.body.email);

        res.redirect(req.originalUrl + '?email=' + emailInput);

        return;
    }

    next();
}

export const Login = passportConfig.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
});

export const ActivateAccount = async (req, res) => {
    const {token} = req.params;

    try {
        const response = await new AuthController().ActivateAccount(token);

        req.flash('info', response.msg);
        req.flash('title', 'Successful');
        res.redirect('/auth/activation-result');
    } catch (error) {
        req.flash('error', error.msg);
        req.flash('title', 'Failed');
        res.redirect('/auth/activation-result');
    }
}

export const RecoverAccount = async (req, res) => {
    const {errors} = validationResult(req);

    if (errors.length) {
        const dataError = errors[0].msg;

        req.flash('error', dataError);

        const emailInput = encodeURIComponent(req.body.email);

        res.redirect(req.originalUrl + '?email=' + emailInput);

        return;
    }

    const {email} = req.body;

    try {
        const response = await new AuthController().RecoverAccount(email);

        req.flash('info', response.msg);

        res.redirect(req.originalUrl);
    } catch (error) {
        req.flash('error', error.msg);
        console.log(error);
        const emailInput = encodeURIComponent(req.body.email);

        res.redirect(req.originalUrl + '?email=' + emailInput);
    }
}

export const VerifyResetPasswordToken = async (req, res, next) => {
    const {token} = req.params;

    try {
        const response = await new AuthController().VerifyResetPasswordToken(token);

        req.flash('id_user', response.data.id_user);

        next();
    } catch (error) {

        res.render('public/new-password', {
            pageTitle: 'UpTask | Reset Password Failed',
            error: error.msg,
            resetFailed: true,
            info: ''
        });
    }
}

export const ResetPassword = async (req, res) => {
    const id_user = req.flash('id_user');
    //almacenar temporalmente el id de usuario
    req.flash('id_user', id_user);

    const {errors} = validationResult(req);

    if (errors.length) {
        const dataError = errors[0].msg;

        res.render('public/new-password', {
            pageTitle: 'UpTask | New Password',
            error: dataError,
            info: ''
        });

        return;
    }

    const password = req.body.password;

    try {
        const response = await new AuthController().ResetPassword(id_user, password);
        
        res.render('public/new-password', {
            pageTitle: 'UpTask | Reset Password Successful',
            error: '',
            successful: true,
            info: response.msg
        });
    } catch (error) {
        res.render('public/new-password', {
            pageTitle: 'UpTask | Reset Password Failed',
            error: error.msg,
            resetFailed: true,
            info: ''
        });
    }
}

export const VerifyAuth = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/auth/login');
        return;
    }
    res.locals.user = req.user;
    next();
}

export const Logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
}