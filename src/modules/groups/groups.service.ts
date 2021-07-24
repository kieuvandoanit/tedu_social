import { HttpException } from "@core/exceptions";
import { UserSchema } from "@modules/users";
import GroupSchema from './groups.model';
import CreateGroupDto from "./dtos/create_group.dto";
import { IGroup, IMember } from "./groups.interface";

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

    public async updateGroup(groupId: string, groupDto: CreateGroupDto):Promise<IGroup>{
        const group = await GroupSchema.findById(groupId);

        if(!group) throw new HttpException(400, 'Group is not found');

        const existingGroup = await GroupSchema.find({
            $and: [
                {$or: [{name: groupDto.name}, {code: groupDto.code}]},
                {_id: {$ne: groupId}}
            ],
        }).exec();

        if(existingGroup.length > 0) throw new HttpException(400, 'Name or code existed');

        const groupFields = {...groupDto};

        const updatedGroup = await GroupSchema.findOneAndUpdate(
            {_id: groupId},
            {$set: groupFields},
            {new: true}
        ).exec();
        
        if(!updatedGroup) throw new HttpException(400, 'UpdatedGroup is not success');

        return updatedGroup;
    }


    public async deleteGroup(groupId: string): Promise<IGroup>{
        const group = await GroupSchema.findById(groupId).exec();

        if(!group) throw new HttpException(400, 'Group is not found');

        const deleteGroup = await GroupSchema.findOneAndDelete({_id: groupId}).exec();

        if(!deleteGroup) throw new HttpException(400, 'DeleteGroup is not success');

        return deleteGroup;
    }

    public async joinGroup(userId: string, groupId: string): Promise<IGroup>{
        const user = await UserSchema.findById(userId).exec();
        if(!user) throw new HttpException(400, 'User is not found');
        
        const group = await GroupSchema.findById(groupId).exec();
        if(!group) throw new HttpException(400, 'Group is not found');

        if(group.members && group.members.some((member: IMember) => member.user.toString() === userId)) throw new HttpException(400, 'User has been already a member');
        if(group.member_requests && group.member_requests.some((member: IMember) => member.user.toString() === userId)) throw new HttpException(400, 'User has been send a request to join this group');
        
        group.member_requests.unshift({user: userId} as IMember);

        await group.save();
        return group;
    }

    public async approveJoinRequest(userId: string, groupId: string): Promise<IGroup>{
        const user = await UserSchema.findById(userId).exec();
        if(!user) throw new HttpException(400, 'User is not found');
        
        const group = await GroupSchema.findById(groupId).exec();
        if(!group) throw new HttpException(400, 'Group is not found');

        if(group.members && group.members.some((member: IMember) => member.user.toString() === userId)) throw new HttpException(400, 'User has been already a member');
        
        let haveRequest = 0;
        if(group.member_requests && group.member_requests.some((member: IMember) => member.user.toString() !== userId)) throw new HttpException(400, 'There is not any request of this user');
        
        group.member_requests = group.member_requests.filter(({user}) => user.toString() !== userId);

        group.members.unshift({user: userId} as IMember);
        await group.save();
        return group;
    }
}