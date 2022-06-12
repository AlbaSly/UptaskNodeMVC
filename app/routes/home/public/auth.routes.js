import { Router } from "express";

import { 
    ActivateAccount, 
    LoginValidation,
    Login,
    Logout, 
    RecoverAccount, 
    ResetPassword, 
    ShowActivationResultView,
    ShowLoginView, 
    ShowNewPasswordView, 
    ShowRecoverAccountView, 
    ShowSignUpView, 
    SignUp, 
    VerifyResetPasswordToken} from "../../../middlewares/home/auth.mw.js";
import { AuthValidator } from "../../../validations/auth/auth.validator.js";

export const AuthRouter = Router();

const AuthRouterChilds = Router({mergeParams: true});

AuthRouter.use('/auth', AuthRouterChilds);

AuthRouterChilds.get('/signup', ShowSignUpView);
AuthRouterChilds.post('/signup', AuthValidator.SignUp, SignUp);
AuthRouterChilds.get('/login', ShowLoginView);
AuthRouterChilds.post('/login', AuthValidator.Login, LoginValidation, Login);
AuthRouterChilds.get('/activation/:token', ActivateAccount);
AuthRouterChilds.get('/activation-result', ShowActivationResultView);
AuthRouterChilds.get('/recover-account', ShowRecoverAccountView);
AuthRouterChilds.post('/recover-account', AuthValidator.RecoverAccount, RecoverAccount);
AuthRouterChilds.get('/reset-password/:token', VerifyResetPasswordToken, ShowNewPasswordView);
AuthRouterChilds.post('/new-password', AuthValidator.NewPassword, ResetPassword);
AuthRouterChilds.get('/logout', Logout);