import { Route } from "@core/interfaces";
import { authMiddleware, validationMiddleware } from "@core/middleware";
import Router from 'express';
import CreateGroupDto from "./dtos/create_group.dto";
import SetManagerDto from "./dtos/set_manager.dto";
import GroupController from "./groups.controller";

export default class GroupRoute implements Route{
    public path = '/api/v1/groups';
    public router = Router();

    public groupController = new GroupController();

    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post(this.path, authMiddleware, validationMiddleware(CreateGroupDto, true), this.groupController.createGroup);
        this.router.get(this.path, this.groupController.getAllGroup);
        this.router.put(this.path+'/:id', authMiddleware,validationMiddleware(CreateGroupDto, true), this.groupController.updateGroup);
        this.router.delete(this.path+'/:id', authMiddleware,this.groupController.deleteGroup);
        this.router.post(this.path+'/member/:id', authMiddleware,this.groupController.joinGroup);
        this.router.put(this.path+'/member/:id/:user_id', authMiddleware,this.groupController.approveJoinRequest);
        this.router.post(this.path+'/manager/:id', authMiddleware,validationMiddleware(SetManagerDto, true), this.groupController.addManager);
        this.router.delete(this.path+'/manager/:id/:user_id', authMiddleware,this.groupController.removeManager);
        this.router.get(this.path+'/members/:id',this.groupController.getAllMember);
        this.router.delete(this.path+'/member/:id/:user_id',authMiddleware, this.groupController.deleteMember);

    }
}

