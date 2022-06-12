import { Router } from "express";

//Middlewares
import { ShowHomeView} from "../../middlewares/home/home.mw.js";
import { VerifyAuth } from "../../middlewares/home/auth.mw.js";

export const HomeRouter = Router();

HomeRouter.get('/', VerifyAuth, ShowHomeView);