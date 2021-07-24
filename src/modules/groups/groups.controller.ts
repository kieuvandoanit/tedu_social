import { NextFunction, Request, Response } from 'express';
import CreateGroupDto from './dtos/create_group.dto';
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
}