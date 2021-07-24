import { HttpException } from "@core/exceptions";
import { UserSchema } from "@modules/users";
import GroupSchema from './groups.model';
import CreateGroupDto from "./dtos/create_group.dto";
import { IGroup } from "./groups.interface";

export default class GroupService {
    public async createGroup(userId: string, groupDto: CreateGroupDto): Promise<IGroup>{
        const user = await UserSchema.findById(userId).select('-password').exec();
        if(!user) throw new HttpException(400, 'User is not found');
        
        const existingGroup = await GroupSchema.find({$or: [{name: groupDto.name}, {code: groupDto.code}],}).countDocuments().exec();

        if(existingGroup > 0) throw new HttpException(400, 'Name or code exitsted');
        
        const newGroup = new GroupSchema({
            ...groupDto,
        });

        const group = newGroup.save();
        return group;
    }

    public async getAllGroup(): Promise<IGroup[]>{
        const groups = GroupSchema.find().exec();
        return groups;
    }
}