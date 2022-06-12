import { HomeRouter } from "./home/home.routes.js";
import { AuthRouter } from "./home/public/auth.routes.js";
import { ProjectsRouter } from "./projects/projects.routes.js";
import { TasksRouter } from "./tasks/tasks.routes.js";

export const RouteDeclarations = {
    path: '/',
    routes: [
        HomeRouter,
        ProjectsRouter,
        TasksRouter,
        AuthRouter
    ]
}