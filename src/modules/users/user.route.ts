import { Route } from "@core/interfaces";
import { Router } from "express";
import UsersController from "./users.controller";

export default class IndexRoute implements Route{
    public path = '/api/users';
    public router = Router();
    
    public usersController = new UsersController();

    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post(this.path, this.usersController.register);
    }
}