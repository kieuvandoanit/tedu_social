import { NextFunction, Request, Response } from 'express';
import CreateGroupDto from './dtos/create_group.dto';
import SetManagerDto from './dtos/set_manager.dto';
import { IGroup } from './groups.interface';
import GroupService from './groups.service';

export default class GroupController{
    private groupService = new GroupService();

    public createGroup = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const model: CreateGroupDto = req.body;
            const group: IGroup = await this.groupService.createGroup(req.user.id,model);
            res.status(200).json(group);
        } catch (error) {
            next(error);
        }
    }

    public getAllGroup = async(req: Request, res: Response, next: NextFunction)=>{
        try {
            const group: IGroup[] = await this.groupService.getAllGroup();
            res.status(200).json(group);
        } catch (error) {
            next(error);
        }
    }

    public updateGroup = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const groupId = req.params.id;
            const updateGroup:IGroup = req.body;
            const result:IGroup = await this.groupService.updateGroup(groupId, updateGroup);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public deleteGroup = async (req: Request, res: Response, next:NextFunction)=>{
        try {
            const groupId = req.params.id;
            const result:IGroup = await this.groupService.deleteGroup(groupId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public joinGroup = async (req: Request, res: Response, next:NextFunction) =>{
        try {
            const groupId = req.params.id;
            const userId = req.user.id;
            const result: IGroup = await this.groupService.joinGroup(userId, groupId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public approveJoinRequest = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const groupId = req.params.id;
            const userId = req.params.user_id;
            const result: IGroup = await this.groupService.approveJoinRequest(userId, groupId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public addManager = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const groupId = req.params.id;
            const model: SetManagerDto = req.body;
            const group = await this.groupService.addManager(groupId, model);
            res.status(200).json(group); 
        } catch (error) {
            next(error);
        }
    }

    public removeManager = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const groupId = req.params.id;
            const userId = req.params.user_id;
            const group = await this.groupService.removeManager(groupId, userId);
            res.status(200).json(group); 
        } catch (error) {
            next(error);
        }
    }

    public getAllMember = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const groupId = req.params.id;
            const users = await this.groupService.getAllMember(groupId);
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    
}